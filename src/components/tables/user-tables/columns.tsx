"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/config/data";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "email",
    header: "EMAIL",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: (row) => (row.cell.getValue() === "seller" ? "Seller" : "Buyer"),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: (row) =>
      row.cell.getValue()
        ? new Date(row.cell.getValue() as string).toLocaleDateString()
        : "N/A",
  },
];
