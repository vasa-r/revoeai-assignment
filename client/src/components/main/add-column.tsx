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

interface AddColumnProps {
  triggerLabel: React.ReactNode | string;
  tableId: string;
}

// Schema for validation
const columnSchema = z.object({
  columnName: z.string().min(3, "Minimum 3 characters required"),
  columnType: z.enum(["Text", "Date"]),
});

export function AddColumn({ triggerLabel, tableId }: AddColumnProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof columnSchema>>({
    resolver: zodResolver(columnSchema),
    defaultValues: { columnName: "", columnType: "Text" },
  });

  const onSubmit = (data: z.infer<typeof columnSchema>) => {
    console.log(data);
  };

  return (
    <Dialog>
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          {/* Column Name */}
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

          {/* Data Type Selection */}
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

          {/* Submit Button */}
          <DialogFooter>
            <Button type="submit">Add Column</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
