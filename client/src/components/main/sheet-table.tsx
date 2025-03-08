"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Column } from "@/types/types";

interface SheetTableProps {
  columns: Column[];
}

export function SheetTable({ columns }: SheetTableProps) {
  const maxRows = Math.max(...columns.map((col) => col.rows.length));
  return (
    <div className="w-full overflow-auto">
      <Table className="w-full border-collapse border border-border rounded-md min-w-max">
        <TableHeader className="border-b border-border">
          <TableRow>
            <TableHead className="border-r border-border px-2 w-[60px] text-center">
              SI.No
            </TableHead>
            {columns.map((col) => (
              <TableHead
                key={col.columnName}
                className="border-r border-border px-2 text-left min-w-[150px] max-w-[260px]"
              >
                {col.columnName}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {maxRows > 0 ? (
            Array.from({ length: maxRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-border">
                <TableCell className="border-r border-border px-2 text-center">
                  {rowIndex + 1}
                </TableCell>

                {columns.map((col, idx) => (
                  <TableCell
                    key={`${col.columnName}-${idx}`}
                    className="border-r border-border px-2 text-left"
                  >
                    {col.rows[rowIndex]?.value ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className="border-b border-border font-medium">
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-4"
              >
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
