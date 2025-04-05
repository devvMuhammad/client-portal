import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth";

import { ShowConfetti } from "@/components/show-confetti";
import { getOtherUser } from "@/actions/other-user";
import ChatWindow from "@/components/chat/ChatWindow";
import { Metadata } from "next";

export type UserType = {
  id: string;
  name: string;
  image: string;
  email: string;
};

export const metadata: Metadata = {
  title: "Chat Room",
};

export default async function Page({
  params: { chatId },
}: {
  params: { chatId: string };
}) {
  const session = await getAuth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = session.user.id as string;
  const currentUser = session.user;
  const { otherUser, error } = await getOtherUser(chatId, userId);

  return (
    <>
      <ShowConfetti />
      <ChatWindow
        chatId={chatId}
        error={error}
        otherUser={otherUser}
        currentUser={currentUser}
      />
    </>
  );
}
