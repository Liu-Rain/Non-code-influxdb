"use client";

import * as React from "react";

import { DateRange } from "react-day-picker";

import {
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";

import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckIcon } from "lucide-react";
import { useStore } from "zustand";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DateInput } from "@/components/ui/date-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BaseNode } from "@/features/flow/components/flow-nodes/base-node";
import {
  NodeProps,
  NodeType,
  NodeData,
} from "@/features/flow/components/flow-nodes/types";
import { NODE_TITLES } from "@/features/flow/components/sidebar/constants";
import { useDateRange } from "@/features/flow/hooks/use-date-range";
import { cn } from "@/lib/utils";

interface Preset {
  name: string;
  label: string;
}

const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
];

export function DateRangeNode({ id }: NodeProps) {
  const { updateNodeData } = useReactFlow();
  const { setDateRange } = useStore(useDateRange, (state) => ({
    setDateRange: state.setDateRange,
  }));

  const nodeData = useNodesData(id)?.data as NodeData;
  const { value } = nodeData;

  const bucketConnections = useHandleConnections({
    type: "target",
    id: "BUCKET" as NodeType,
  });
  const bucketData = useNodesData(bucketConnections?.[0]?.source)
    ?.data as NodeData;

  const parseDateRange = (value: string): DateRange | undefined => {
    const [fromStr, toStr] = value.split(" - ");
    const from = new Date(fromStr);
    const to = toStr ? new Date(toStr) : undefined;
    return { from, to };
  };

  const initialDateRange =
    value && value !== "Pick a date range"
      ? parseDateRange(value)
      : {
          from: undefined,
          to: undefined,
        };

  const [range, setRange] = React.useState<DateRange | undefined>(
    initialDateRange,
  );

  const [selectedPreset, setSelectedPreset] = React.useState<
    string | undefined
  >(undefined);

  React.useEffect(() => {
    if (range?.from) {
      const formattedDate = range.to
        ? `${format(range.from, "LLL dd, y")} - ${format(range.to, "LLL dd, y")}`
        : format(range.from, "LLL dd, y");

      setDateRange(formattedDate);
      updateNodeData(id, {
        value: formattedDate,
        result: {
          ...bucketData?.result,
          timeStart: format(range.from, "yyyy-MM-dd'T'HH'%3A'mm'%3A'ss'Z'"),
          timeStop: range.to
            ? format(range.to, "yyyy-MM-dd'T'HH'%3A'mm'%3A'ss'Z'")
            : undefined,
        },
      });
    } else {
      setDateRange("");
      updateNodeData(id, {
        value: undefined,
        result: {
          ...bucketData?.result,
          timeStart: undefined,
          timeStop: undefined,
        },
      });
    }
  }, [bucketData, range, id, updateNodeData, setDateRange]);

  const handleDateChange = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
  };

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS?.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown date range preset: ${presetName}`);
    const from = new Date();
    const to = new Date();
    const first = from.getDate() - from.getDay();

    switch (preset.name) {
      case "today":
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
        break;
      case "last7":
        from.setDate(from.getDate() - 6);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last14":
        from.setDate(from.getDate() - 13);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last30":
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisWeek":
        from.setDate(first);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        from.setDate(from.getDate() - 7 - from.getDay());
        to.setDate(to.getDate() - to.getDay() - 1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
  };

  const checkPreset = React.useCallback((): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range?.from ?? 0);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from?.setHours(0, 0, 0, 0) ?? 0,
      );

      const normalizedRangeTo = new Date(range?.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  }, [range]);

  React.useEffect(() => {
    checkPreset();
    console.log("checkPreset");
  }, [checkPreset, range]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }): JSX.Element => (
    <Button
      className={cn(
        isSelected && "pointer-events-none",
        "flex w-full justify-between px-3",
      )}
      variant="ghost"
      onClick={() => {
        setPreset(preset);
      }}
    >
      <>
        <span className={cn("pr-2 opacity-0", isSelected && "opacity-70")}>
          <CheckIcon width={18} height={18} />
        </span>
        {label}
      </>
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger>
        <BaseNode
          title={NODE_TITLES.DATE_RANGE}
          value={value ?? "Pick a date range"}
          icon={CalendarIcon}
          upHandleId="BUCKET"
          underHandleId="DATE_RANGE"
          upHandle
          underHandle
        />
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center justify-center gap-2 px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range?.from}
                      onChange={(date) => {
                        const toDate =
                          range?.to == null || date > range?.to
                            ? date
                            : range?.to;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate,
                        }));
                      }}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={range?.to}
                      onChange={(date) => {
                        const fromDate =
                          date < (range?.from ?? date)
                            ? date
                            : (range?.from ?? date);
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from != null) {
                      handleDateChange({ from: value.from, to: value?.to });
                    }
                  }}
                  selected={range}
                  numberOfMonths={2}
                  defaultMonth={
                    new Date(new Date().setMonth(new Date().getMonth() - 1))
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 pl-2">
            <div className="flex w-full flex-col items-end gap-1">
              {PRESETS?.map((preset) => (
                <PresetButton
                  key={preset.name}
                  preset={preset.name}
                  label={preset.label}
                  isSelected={selectedPreset === preset.name}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
