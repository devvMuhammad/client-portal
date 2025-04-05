"use server";

import { getAuth } from "@/lib/auth";

export async function getSessionFromClient() {
  return await getAuth();
}
