import * as React from "react";

import { flexRender } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "@/features/visualization/constants";
import { useTable } from "@/features/visualization/hooks/use-table";
import { useIsClient } from "@/hooks/use-is-client";

function DataTable({ table }: { table: ReturnType<typeof useTable> }) {
  const isClient = useIsClient();
  return isClient ? (
    <>
      <div className="rounded-md border">
        <Table aria-label="Data table" role="table">
          <TableHeader role="rowgroup">
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup.id} role="row">
                {headerGroup.headers?.map((header) => {
                  return (
                    <TableHead key={header.id} role="columnheader" scope="col">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody role="rowgroup">
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row
                    .getVisibleCells()
                    ?.map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div
          className="flex-1 text-sm text-muted-foreground"
          aria-live="polite"
          aria-atomic="true"
        >
          {table?.getFilteredSelectedRowModel().rows.length} of{" "}
          {table?.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.previousPage()}
            disabled={!table?.getCanPreviousPage()}
            aria-label="Previous page"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.nextPage()}
            disabled={!table?.getCanNextPage()}
            aria-label="Next page"
          >
            Next
          </Button>
        </div>
      </div>
    </>
  ) : null;
}

export { DataTable };
