import React from "react";

import { useNodesData, useReactFlow } from "@xyflow/react";

import { Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BaseNode,
  BaseNodeProps,
} from "@/features/flow/components/flow-nodes/base-node";
import { cn } from "@/lib/utils";

type ComboNodeProps = Pick<
  BaseNodeProps,
  "title" | "icon" | "upHandle" | "underHandle" | "underHandleId" | "upHandleId"
> & {
  selections?: string[];
  onSelectNodeOption?: ((_value: string | undefined) => void) | undefined;
  initialValue?: string;
  id: string;
  isPreviousNodeValueChanged: boolean;
};

export function ComboboxNode({
  id,
  title: type,
  icon,
  selections,
  underHandle,
  upHandle,
  underHandleId,
  upHandleId,
  onSelectNodeOption,
  isPreviousNodeValueChanged,
}: ComboNodeProps) {
  const [open, setOpen] = React.useState(false);
  const { updateNodeData } = useReactFlow();
  const nodeData = useNodesData(id);
  const value = nodeData?.data?.value as string | undefined;
  const result = nodeData?.data?.result as Record<string, any> | undefined;

  React.useEffect(() => {
    if (isPreviousNodeValueChanged && result?.[type] !== undefined) {
      updateNodeData(id, {
        value: undefined,
        result: { ...result, [type]: undefined },
      });
    }
  }, [id, isPreviousNodeValueChanged, result, type, updateNodeData]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <BaseNode
          value={value || `Select a ${type}`}
          title={type}
          icon={icon}
          underHandle={underHandle}
          upHandle={upHandle}
          underHandleId={underHandleId}
          upHandleId={upHandleId}
          ariaExpanded={open}
        />
      </PopoverTrigger>
      <PopoverContent align="center" className="w-[200px] p-0">
        <Command>
          {selections && selections.length > 0 && (
            <CommandInput
              placeholder={`Search ${type.charAt(0).toUpperCase() + type.slice(1)}...`}
              className="text-[10px]"
            />
          )}
          <CommandList>
            <CommandEmpty
              className="flex items-center justify-center p-3 text-xs"
              aria-label={`No ${type} found.`}
            >
              No {type} found.
            </CommandEmpty>
            {selections && selections.length > 0 && (
              <CommandGroup>
                {selections?.map((selection) => (
                  <CommandItem
                    key={selection}
                    value={selection}
                    aria-label={`Select ${selection}`}
                    onSelect={(currentValue) => {
                      updateNodeData(id, {
                        value: currentValue === value ? "" : currentValue,
                      });
                      onSelectNodeOption?.(
                        currentValue === value ? undefined : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === selection ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden={value === selection}
                    />
                    <span className="text-xs" aria-hidden={value === selection}>
                      {selection}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
