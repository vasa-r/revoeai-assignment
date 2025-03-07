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
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";
import { useSidebar } from "../ui/sidebar";
import { DeleteDialog } from "./delete-dialog";
import { EditTableDialog } from "./edit-table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export function TableList() {
  const { state } = useSidebar();
  return (
    <Table width={500}>
      <TableCaption>A list of your recent created tables.</TableCaption>
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
        {invoices.map((invoice, idx) => (
          <TableRow key={invoice.invoice} className="font-medium">
            <TableCell className="w-1/7">{idx + 1}</TableCell>
            <TableCell className="w-1/7">{invoice.invoice}</TableCell>
            <TableCell className="w-1/7 hidden sm:table-cell">
              {invoice.paymentStatus}
            </TableCell>
            <TableCell className="w-1/7 hidden sm:table-cell">
              {invoice.paymentMethod}
            </TableCell>
            <TableCell className=" text-center flex gap-4 justify-center items-center">
              <button className="text-blue-500 hover:text-blue-700">
                <EditTableDialog triggerLabel={<Edit size={18} />} />
              </button>
              <button className="text-red-500 hover:text-red-700">
                <DeleteDialog
                  triggerLabel={<Trash2 size={18} />}
                  description="your table with all the associated columns with it"
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
                key={state}
              >
                <Link href={"#"}>View</Link>
              </RoughNotation>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
