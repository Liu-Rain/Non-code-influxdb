import { ColumnDef } from "@tanstack/react-table";

import { ArrowUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Row } from "@/features/visualization/types";

export const columns: ColumnDef<Row>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all rows on this page"
        className="flex h-4 w-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="flex h-4 w-4"
        aria-label={`Select row ${row.index + 1}, ${row.getValue("time")} ${row.getValue("value")} ${row.getValue("field")} ${row.getValue("measurement")} ${row.getValue("room")}`}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "measurement",
    accessorKey: "measurement",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full"
        >
          <div className="flex items-center justify-center">
            Measurement
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-center"
        aria-label={`Measurement: ${row.getValue("measurement")}`}
      >
        {row.getValue("measurement")}
      </div>
    ),
  },
  {
    id: "field",
    accessorKey: "field",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full"
        >
          <div className="flex items-center justify-center">
            Field
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-center"
        aria-label={`Field: ${row.getValue("field")}`}
      >
        {row.getValue("field")}
      </div>
    ),
  },
  {
    id: "value",
    accessorKey: "value",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
          className="w-full"
        >
          <div className="flex items-center justify-center">
            Value
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className="text-center"
        aria-label={`Value: ${row.getValue("value")}`}
      >
        {row.getValue("value")}
      </div>
    ),
  },
  {
    id: "start",
    accessorKey: "start",
    header: "Start",
  },
  {
    id: "stop",
    accessorKey: "stop",
    header: "Stop",
  },
  {
    id: "time",
    accessorKey: "time",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by time"
        >
          <div className="flex items-center justify-center">
            Time
            <ArrowUpDownIcon className="ml-2 h-4 w-4" />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="text-center" aria-label={`Time: ${row.getValue("time")}`}>
        {row.getValue("time")}
      </div>
    ),
  },
  {
    id: "room",
    accessorKey: "room",
    header: () => <div className="text-center">Room</div>,
    cell: ({ row }) => (
      <div className="text-center" aria-label={`Room: ${row.getValue("room")}`}>
        {row.getValue("room")}
      </div>
    ),
  },
];

export const chartConfig = {} satisfies ChartConfig;
