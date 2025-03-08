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
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import { DeleteDialog } from "./delete-dialog";
import { TableStat } from "@/context/stat-context";

export function TableList({ tables }: { tables: TableStat[] }) {
  return (
    <Table>
      <TableCaption>A list of your recently created tables.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/7">SI.No</TableHead>
          <TableHead className="w-1/7">Table Name</TableHead>
          <TableHead className="w-1/7 hidden sm:table-cell">Columns</TableHead>
          <TableHead className="w-1/7 hidden sm:table-cell">
            Google Sheets Linked
          </TableHead>
          <TableHead className="w-2/7 text-center">Actions</TableHead>
          <TableHead className="w-1/7 text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tables.length > 0 ? (
          tables.map((table, idx) => (
            <TableRow key={table._id} className="font-medium">
              <TableCell className="w-1/7">{idx + 1}</TableCell>
              <TableCell className="w-1/7">{table.tableName}</TableCell>
              <TableCell className="w-1/7 hidden sm:table-cell">
                {table.columnCount}
              </TableCell>
              <TableCell className="w-1/7 hidden sm:table-cell">
                {table.sheetConnected}
              </TableCell>
              <TableCell className="text-center flex gap-4 justify-center items-center">
                <button className="text-red-500 hover:text-red-700">
                  <DeleteDialog
                    triggerLabel={<Trash2 size={18} />}
                    description={`your table ${table.tableName} with all the associated columns with it`}
                    tableId={table._id}
                  />
                </button>
              </TableCell>
              <TableCell className="w-1/7 text-right">
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
            <TableCell colSpan={6} className="text-center py-4">
              No tables found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
