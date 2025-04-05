"use server";

import { signIn } from "@/lib/auth";

export async function googleSignIn() {
  const data = await signIn("google", { redirectTo: "/chats/all" });
  console.log(data);
}
