"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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
import BtnLoader from "../loader";
import toast from "react-hot-toast";
import { updateTable } from "@/api/table";
import { Dispatch, SetStateAction, useState } from "react";
import { TableData } from "@/types/types";

interface EditTableDialog {
  triggerLabel: React.ReactNode | string;
  tableName: string;
  tableId: string;
  setTable: Dispatch<SetStateAction<TableData | null>>;
}

const tableSchema = z.object({
  tableName: z.string().min(3, "Table name must be at least 3 characters."),
});

export function EditTableDialog({
  triggerLabel,
  tableName,
  tableId,
  setTable,
}: EditTableDialog) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(tableSchema) });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof tableSchema>) => {
    try {
      if (!tableId) {
        console.error("Table ID is missing");
        return;
      }

      if (tableName === data.tableName) {
        toast.error("Why update same name genius?");
        return;
      }

      const response = await updateTable(tableId, {
        tableName: data.tableName,
      });

      if (response.success) {
        const { data } = response.data;
        toast.success("Table name updated successfully!");
        setTable((prev) =>
          prev ? { ...prev, tableName: data.tableName } : prev
        );
        setIsOpen(false);
      } else {
        toast.error("Failed to update table.");
      }
    } catch (error) {
      console.error("Error updating table:", error);
      toast.error("Something went wrong while updating table name.");
    } finally {
      reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerLabel}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Table Name</DialogTitle>
          <DialogDescription>
            Make changes to your table here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              placeholder="Enter new name"
              defaultValue={tableName}
              {...register("tableName")}
            />
            {errors.tableName && (
              <p className="error">{errors.tableName.message}</p>
            )}
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
