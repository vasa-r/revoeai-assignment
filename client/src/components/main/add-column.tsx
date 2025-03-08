"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
} from "../ui/select";
import { BadgeInfo } from "lucide-react";
import TooltipWrapper from "../tooltip-wrapper";
import { createColumn } from "@/api/column";
import toast from "react-hot-toast";
import BtnLoader from "../loader";
import { TableData } from "@/types/types";
import { useState } from "react";

interface AddColumnProps {
  triggerLabel: React.ReactNode | string;
  tableId: string;
  setTable: React.Dispatch<React.SetStateAction<TableData | null>>;
}

// Schema for validation
const columnSchema = z.object({
  columnName: z.string().min(3, "Minimum 3 characters required"),
  columnType: z.enum(["Text", "Date"]),
});

export function AddColumn({ triggerLabel, tableId, setTable }: AddColumnProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof columnSchema>>({
    resolver: zodResolver(columnSchema),
    defaultValues: { columnName: "", columnType: "Text" },
  });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof columnSchema>) => {
    const result = await createColumn(
      tableId,
      data.columnName,
      data.columnType
    );

    if (result.success) {
      toast.success(result.data.message || "Column added successfully");

      setTable((prevTable) => {
        if (!prevTable) return prevTable;

        return {
          ...prevTable,
          columns: [
            ...prevTable.columns,
            {
              _id: result.data.data._id,
              columnName: data.columnName,
              columnType: data.columnType,
              isDynamic: true,
              rows: [],
            },
          ],
        };
      });

      reset();
      setIsOpen(false);
    } else {
      toast.error("Couldn't add column. Try again later.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-md w-fit cursor-pointer" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Column</DialogTitle>
          <DialogDescription>
            Enter a name for the new column. The default data type is
            &quot;Text&quot;.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="columnName">Column Name</Label>
            <Input
              id="columnName"
              placeholder="Enter column name"
              {...register("columnName")}
            />
            {errors.columnName && (
              <p className="error">{errors.columnName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="columnType">
              Data Type
              <TooltipWrapper content="Default type is TEXT">
                <BadgeInfo size={12} className="ml-1 inline" />
              </TooltipWrapper>
            </Label>
            <Select
              onValueChange={(value) =>
                setValue("columnType", value as "Text" | "Date")
              }
              defaultValue="Text"
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

          <DialogFooter>
            <Button type="submit" size="full" disabled={isSubmitting}>
              {isSubmitting ? <BtnLoader /> : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
