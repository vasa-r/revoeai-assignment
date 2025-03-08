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
import { TableData } from "@/types/types";
import { updateTable } from "@/api/table";
import toast from "react-hot-toast";
import BtnLoader from "../loader";
import { Copy, CheckCircle } from "lucide-react";

interface ConnectSheetProps {
  triggerLabel: React.ReactNode | string;
  tableId: string;
  setTable: Dispatch<SetStateAction<TableData | null>>;
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
}: ConnectSheetProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(sheetSchema) });

  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const serviceAccountEmail =
    "sheetsync-api-service@sheetsync-453021.iam.gserviceaccount.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serviceAccountEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Email copied! Now, share the sheet.");
  };

  const onSubmit = async (data: z.infer<typeof sheetSchema>) => {
    try {
      if (!tableId) {
        console.error("Table ID is missing");
        return;
      }

      const response = await updateTable(tableId, {
        googleSheetId: data.googleSheetId,
      });

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
          <DialogTitle>Connect Your Google Spreadsheet</DialogTitle>
          <DialogDescription>
            Follow these steps to link your table with a Google Spreadsheet for
            real-time updates.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Copy and Add Service Account Email */}
        <div className="mb-4 p-3 border rounded-md">
          <h3 className="text-md font-semibold">
            Step 1: Share your Spreadsheet
          </h3>
          <p className="text-xs mt-1.5">
            Copy the email below and add it as an <b>Editor</b> in your Google
            Spreadsheet under the &quot;Share&quot; settings.
          </p>
          <div className="flex items-center space-x-2 mt-2">
            <Input
              id="link"
              value={serviceAccountEmail}
              readOnly
              className=""
            />
            <Button onClick={copyToClipboard} size="sm">
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
            </Button>
          </div>
        </div>

        {/* Step 2: Paste Google Sheet ID */}
        <div className="mb-4 p-3 border rounded-md">
          <h3 className="text-md font-semibold">
            Step 2: Link your Spreadsheet
          </h3>
          <p className="text-xs mt-1.5">
            Paste the Google Sheet <b>link</b> or <b>ID</b> below and click
            &quot;Save Changes&quot;.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="googleSheetId" className="text-right">
              Spreadsheet Link or ID
            </Label>
            <Input
              id="googleSheetId"
              placeholder="Paste spreadsheet link or ID"
              className="col-span-3"
              {...register("googleSheetId")}
            />
            {errors.googleSheetId && (
              <p className="text-red-500 text-sm">
                {errors.googleSheetId.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" size="full" disabled={isSubmitting}>
              {isSubmitting ? <BtnLoader /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
