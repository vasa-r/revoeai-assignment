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

const AddTableModal = ({ triggerLabel }: { triggerLabel: string }) => {
  const [open, setOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([{ name: "", type: "Text" }]);
  const [errors, setErrors] = useState<{
    tableName?: string;
    columns?: string[];
  }>({});

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "Text" }]);
  };

  const handleSubmit = () => {
    const newErrors = validateTable(tableName, columns);
    setErrors(newErrors);

    if (
      !newErrors.tableName &&
      newErrors?.columns?.every((error) => error === "")
    ) {
      console.log("Form submitted", { tableName, columns });
      setOpen(false);
    }
  };

  const resetForm = () => {
    setTableName("");
    setColumns([{ name: "", type: "Text" }]);
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
                  value={col.name}
                  onChange={(e) => {
                    const newColumns = [...columns];
                    newColumns[index].name = e.target.value;
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
                  value={col.type}
                  onValueChange={(value) => {
                    const newColumns = [...columns];
                    newColumns[index].type = value;
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
            Create Table
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTableModal;
