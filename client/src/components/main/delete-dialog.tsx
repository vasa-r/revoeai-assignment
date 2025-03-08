"use client";

import { deleteTable } from "@/api/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useStats } from "@/context/stat-context";
import { useState } from "react";
import toast from "react-hot-toast";

interface DeleteDialog {
  triggerLabel: React.ReactNode | string;
  description?: string;
  tableId: string;
}

export function DeleteDialog({
  triggerLabel,
  description,
  tableId,
}: DeleteDialog) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { removeTableStat } = useStats();
  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteTable(tableId);
    setLoading(false);

    if (result.success) {
      toast.success("Table deleted successfully!");
      removeTableStat(tableId);
      setOpen(false);
    } else {
      toast.error("Failed to delete table. Try again.");
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{triggerLabel}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {description}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <Button variant="destructive" onClick={() => onDelete} text="dialog">
            Delete
          </Button> */}
          <AlertDialogAction onClick={handleDelete} disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
