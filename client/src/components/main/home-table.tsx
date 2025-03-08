"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableStat } from "@/context/stat-context";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";

export function HomeTable({ tables }: { tables: TableStat[] }) {
  return (
    <Table>
      <TableCaption>A list of your recently created tables.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/5">SI.No</TableHead>
          <TableHead className="w-1/5">Table Name</TableHead>
          <TableHead className="w-1/5 hidden sm:table-cell">Columns</TableHead>
          <TableHead className="w-1/5">Google Sheets Linked</TableHead>
          <TableHead className="w-1/5 text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tables.length > 0 ? (
          tables.map((table, idx) => (
            <TableRow key={table._id} className="font-medium">
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{table.tableName}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {table.columnCount}
              </TableCell>
              <TableCell>{table.sheetConnected}</TableCell>
              <TableCell className="text-right">
                <RoughNotation
                  type="underline"
                  animate
                  show
                  color="#7f22fe"
                  animationDuration={1000}
                  padding={0}
                >
                  <Link href={`/tables/${table._id}`}>View</Link>
                </RoughNotation>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-4">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
