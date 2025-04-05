"use client";

import { User } from "@/config/data";
import { useRouter } from "next/navigation";

interface ProductsClientProps {
  data: User[];
}

export default function UserClient({ data }: ProductsClientProps) {
  const router = useRouter();

  return <></>;
}
