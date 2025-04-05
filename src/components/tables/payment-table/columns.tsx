"use client";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentDataType } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Session } from "next-auth";

export const columns: ColumnDef<PaymentDataType>[] = [
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
  },
  {
    accessorKey: "buyerDetails.name",
    header: "NAME",
  },
  {
    accessorKey: "buyerDetails.email",
    header: "EMAIL",
  },
  {
    accessorKey: "amount",
    header: "AMOUNT",
    cell: (row) => formatCurrency(row.cell.getValue() as number),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (row) =>
      row.cell.getValue()
        ? formatDate((row.cell.getValue() as number) * 1000)
        : "N/A",
  },
];
