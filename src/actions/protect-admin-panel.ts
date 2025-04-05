import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function protectAdminPanel() {
  const session = await getAuth();
  if (!session || !session.user) {
    redirect("/auth/login");
  }

  if (session.user.status !== "seller" && session.user.status !== "admin") {
    redirect("/chats/all");
  }

  return session;
}
