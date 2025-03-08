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
import TooltipWrapper from "../tooltip-wrapper";
import { Dispatch, SetStateAction, useState } from "react";
import { Table } from "@/types/types";
import { updateTable } from "@/api/table";
import toast from "react-hot-toast";
import BtnLoader from "../loader";

interface ConnectSheet {
  triggerLabel: React.ReactNode | string;
  tableId: string;
  setTable: Dispatch<SetStateAction<Table | null>>;
}

const sheetSchema = z.object({
  googleSheetId: z
    .string()
    .min(1, "Google Sheet ID or URL is required")
    .refine((input) => {
      const sheetIdRegex = /^[a-zA-Z0-9-_]{30,}$/;
      const urlRegex =
        /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;

      return sheetIdRegex.test(input) || urlRegex.test(input);
    }, "Invalid Google Sheet ID or URL"),
});

export function ConnectSheet({
  triggerLabel,
  tableId,
  setTable,
}: ConnectSheet) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(sheetSchema) });

  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof sheetSchema>) => {
    try {
      if (!tableId) {
        console.error("Table ID is missing");
        return;
      }

      const response = await updateTable(tableId, {
        googleSheetId: data.googleSheetId,
      });

      console.log(response.data);

      if (response.success) {
        const { data } = response.data;
        toast.success(data.message || "Sheet connected successfully!");
        setTable((prev) =>
          prev ? { ...prev, googleSheetId: data.googleSheetId } : prev
        );
        setIsOpen(false);
      } else {
        toast.error(response.data.message || "Failed to connect sheet.", {
          duration: 6000,
        });
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
      <TooltipWrapper content="Integrate your Google Spreadsheet">
        <DialogTrigger asChild>
          <Button className="rounded-md w-fit cursor-pointer" size="sm">
            {triggerLabel}
          </Button>
        </DialogTrigger>
      </TooltipWrapper>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect you Google Spreadsheet</DialogTitle>
          <DialogDescription>
            Connect your table to a Google Spreadsheet to enable real-time data
            synchronization. Any updates made in the linked sheet will
            automatically reflect in your table.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="googleSheetId" className="text-right">
              Spreadsheet link or ID
            </Label>
            <Input
              id="googleSheetId"
              placeholder="Paste spreadsheet link or ID"
              className="col-span-3"
              {...register("googleSheetId")}
            />
            {errors.googleSheetId && (
              <p className="error">{errors.googleSheetId.message}</p>
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
