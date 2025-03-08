"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Column, TableData } from "@/types/types";
import { useState } from "react";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import getFormattedData from "@/hooks/column-formatter";
import { updateColumnValues } from "@/api/column";
import toast from "react-hot-toast";

interface SheetTableProps {
  columns: Column[];
  setTable: React.Dispatch<React.SetStateAction<TableData | null>>;
}

export function SheetTable({ columns, setTable }: SheetTableProps) {
  const maxRows = Math.max(...columns.map((col) => col.rows.length));

  const [editedData, setEditedData] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    colId: string,
    rowIndex: number,
    value: string
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [`${colId}-${rowIndex}`]: value,
    }));
  };

  const handleSave = async () => {
    const formattedData = getFormattedData(editedData);
    const response = await updateColumnValues(formattedData);

    if (response.success) {
      toast.success("Table data saved successfully!");

      setTable((prevTable) => {
        if (!prevTable) return prevTable;

        const updatedColumns = prevTable.columns.map((col) => {
          const updatedValues = response.data.data.find(
            (newCol: Column) => newCol._id === col._id
          )?.rows;

          const newRows = [...col.rows];

          updatedValues?.forEach(
            (updatedRow: { value: string }, rowIndex: number) => {
              if (!newRows[rowIndex]) {
                newRows[rowIndex] = {
                  value: updatedRow.value,
                  createdAt: new Date().toISOString(),
                };
              } else if (newRows[rowIndex].value === "__EMPTY__") {
                newRows[rowIndex].value = updatedRow.value;
              }
            }
          );

          return { ...col, rows: newRows };
        });

        return { ...prevTable, columns: updatedColumns };
      });

      setEditedData({});
    } else {
      toast.error("Failed to save table data");
    }
  };

  return (
    <div className="w-full overflow-auto flex flex-col gap-2">
      <Button className="w-fit self-end" onClick={handleSave}>
        Save
      </Button>
      <Table className="w-full border-collapse border border-border rounded-md min-w-max">
        <TableHeader className="border-b border-border">
          <TableRow>
            <TableHead className="border-r border-border px-2 w-[60px] text-center">
              SI.No
            </TableHead>
            {columns.map((col, idx) => (
              <TableHead
                key={`${col._id + idx}`}
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
                    key={`${col._id + idx}`}
                    className="border-r border-border px-2 text-left"
                  >
                    {col.isDynamic ? (
                      col.columnType === "Text" ? (
                        <Input
                          value={
                            editedData[`${col._id}-${rowIndex}`] !== undefined
                              ? editedData[`${col._id}-${rowIndex}`]
                              : col.rows[rowIndex]?.value === "__EMPTY__"
                              ? ""
                              : col.rows[rowIndex]?.value || ""
                          }
                          onChange={(e) =>
                            handleInputChange(col._id, rowIndex, e.target.value)
                          }
                          placeholder="Enter text"
                        />
                      ) : col.columnType === "Date" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full flex justify-between px-3 py-2 text-sm font-medium"
                            >
                              {editedData[`${col._id}-${rowIndex}`]
                                ? format(
                                    new Date(
                                      editedData[`${col._id}-${rowIndex}`]
                                    ),
                                    "yyyy-MM-dd"
                                  )
                                : col.rows[rowIndex]?.value &&
                                  col.rows[rowIndex]?.value !== "__EMPTY__"
                                ? format(
                                    new Date(col.rows[rowIndex]?.value),
                                    "yyyy-MM-dd"
                                  )
                                : "Pick a date"}
                              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={
                                editedData[`${col._id}-${rowIndex}`]
                                  ? new Date(
                                      editedData[`${col._id}-${rowIndex}`]
                                    )
                                  : col.rows[rowIndex]?.value &&
                                    col.rows[rowIndex]?.value !== "__EMPTY__"
                                  ? new Date(col.rows[rowIndex]?.value)
                                  : undefined
                              }
                              onSelect={(date) =>
                                handleInputChange(
                                  col._id,
                                  rowIndex,
                                  date ? format(date, "yyyy-MM-dd") : ""
                                )
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      ) : (
                        "-"
                      )
                    ) : col.rows[rowIndex]?.value &&
                      col.rows[rowIndex]?.value !== "__EMPTY__" ? (
                      col.rows[rowIndex]?.value
                    ) : (
                      "-"
                    )}
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
