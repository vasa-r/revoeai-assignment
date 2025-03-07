import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { RoughNotation } from "react-rough-notation";

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

export function TableDemo() {
  return (
    <Table width={500}>
      <TableCaption>A list of your recent created tables.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/5">SI.No</TableHead>
          <TableHead className="w-1/5">Table Name</TableHead>
          <TableHead className="w-1/5 hidden sm:table-cell">Columns</TableHead>
          <TableHead className="w-1/5">Google Sheets Linked</TableHead>
          <TableHead className="w-1/5 text-right"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice, idx) => (
          <TableRow key={invoice.invoice} className="font-medium">
            <TableCell className="">{idx + 1}</TableCell>
            <TableCell className="">{invoice.invoice}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {invoice.paymentStatus}
            </TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">
              <RoughNotation
                type="underline"
                animate
                show
                color="#7f22fe"
                animationDuration={1000}
                padding={0}
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
