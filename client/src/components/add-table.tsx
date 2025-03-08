"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import validateTable from "@/validation/table-validation";
import TooltipWrapper from "./tooltip-wrapper";
import toast from "react-hot-toast";
import { Column, createTable } from "@/api/table";
import BtnLoader from "./loader";
import { useStats } from "@/context/stat-context";

const AddTableModal = ({ triggerLabel }: { triggerLabel: string }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<Column[]>([
    { columnName: "", columnType: "Text" },
  ]);
  const [errors, setErrors] = useState<{
    tableName?: string;
    columns?: string[];
  }>({});
  const { refreshStats } = useStats();

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const addColumn = () => {
    setColumns([...columns, { columnName: "", columnType: "Text" }]);
  };

  const handleSubmit = async () => {
    const newErrors = validateTable(tableName, columns);
    setErrors(newErrors);

    if (
      !newErrors.tableName &&
      newErrors?.columns?.every((error) => error === "")
    ) {
      try {
        setLoading(true);
        const response = await createTable(tableName, columns);

        if (response.success) {
          toast.success(response.data.message || "Table created successfully!");
          setOpen(false);
          refreshStats();
        } else {
          toast.error(
            response.data.message || "Couldn't create table. Try again."
          );
        }
      } catch (error) {
        console.error(error);
        toast.error(`Error:  Failed to create table`);
      } finally {
        resetForm();
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setTableName("");
    setColumns([{ columnName: "", columnType: "Text" }]);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
          <DialogDescription>
            Enter the details for your new table and click create.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="table-name">Table Name</Label>
            <Input
              id="table-name"
              placeholder="Enter table name"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
            {errors.tableName && (
              <p className="text-red-400 text-xs">{errors.tableName}</p>
            )}
          </div>
          {columns.map((col, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`col-name-${index}`}>Column Name</Label>
                <Input
                  id={`col-name-${index}`}
                  placeholder="Enter column name"
                  value={col.columnName}
                  onChange={(e) => {
                    const newColumns = [...columns];
                    newColumns[index].columnName = e.target.value;
                    setColumns(newColumns);
                  }}
                />
                {errors.columns && errors.columns[index] && (
                  <p className="text-red-400 text-xs">
                    {errors.columns[index]}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`col-type-${index}`}>Data Type</Label>
                <Select
                  value={col.columnType}
                  onValueChange={(value) => {
                    const newColumns = [...columns];
                    newColumns[index].columnType = value as "Text" | "Date";
                    setColumns(newColumns);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Text">Text</SelectItem>
                    <SelectItem value="Date">Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
          <TooltipWrapper content="Add new Column">
            <Button variant="outline" onClick={addColumn} className="mt-2">
              + Add Column
            </Button>
          </TooltipWrapper>
        </div>
        <DialogFooter className="center">
          <Button size="full" onClick={handleSubmit}>
            {loading ? <BtnLoader /> : "Create Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableModal;
