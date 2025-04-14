import * as React from "react";

import { CSVLink } from "react-csv";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/features/visualization/components/chart";
import { DataTable } from "@/features/visualization/components/data-table";
import { useTable } from "@/features/visualization/hooks/use-table";

export function Visualization() {
  const table = useTable();

  const rows = table.getIsSomeRowsSelected()
    ? table.getSelectedRowModel().rows
    : table.getCoreRowModel().rows;

  const displayedData = rows?.map((row) => {
    const visibleData: Record<string, any> = {};
    table.getVisibleFlatColumns()?.forEach((column) => {
      if (column.id === "select") return;
      visibleData[column.id] = row.getValue(column.id);
    });
    return visibleData;
  });

  return (
    <section className="h-full w-full overflow-y-scroll border-none">
      <Tabs defaultValue="table">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex flex-col justify-center gap-1 p-0">
            <TabsList>
              <TabsTrigger value="table" className="text-xs font-semibold">
                Data Preview
              </TabsTrigger>
              <TabsTrigger value="line" className="text-xs font-semibold">
                Line Chart
              </TabsTrigger>
              <TabsTrigger value="bar" className="text-xs font-semibold">
                Bar Chart
              </TabsTrigger>
              <TabsTrigger value="area" className="text-xs font-semibold">
                Area Chart
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="table" className="mt-0">
            <div className="flex items-center gap-2">
              <Button
                className="px-3 text-xs font-semibold"
                asChild={displayedData?.length !== 0}
                disabled={displayedData?.length === 0}
                variant="outline"
              >
                <CSVLink data={displayedData} filename="export.csv">
                  Export CSV
                </CSVLink>
              </Button>
              <Input
                placeholder="Filter rooms..."
                value={
                  (table.getColumn("room")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) => {
                  table?.getColumn("room")?.setFilterValue(event.target.value);
                }}
                className="max-w-[150px] text-xs font-semibold"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="px-3 text-xs font-semibold"
                  >
                    Columns <ChevronDownIcon className="ml-4 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    ?.filter((column) => column?.getCanHide())
                    ?.map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </TabsContent>
        </div>
        <TabsContent value="table" className="mt-0">
          <div className="px-8 pb-0">
            <DataTable table={table} />
          </div>
        </TabsContent>
        <TabsContent value="line" className="mt-0">
          <div className="max-h-[350px] px-8 pb-8">
            <Chart type="line" />
          </div>
        </TabsContent>
        <TabsContent value="bar" className="mt-0">
          <div className="max-h-[350px] px-8 pb-8">
            <Chart type="bar" />
          </div>
        </TabsContent>
        <TabsContent value="area" className="mt-0">
          <div className="max-h-[350px] px-8 pb-8">
            <Chart type="area" />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
