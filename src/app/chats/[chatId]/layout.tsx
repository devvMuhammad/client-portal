import Chats from "@/components/chat/Chats";
import ServiceNavbar from "@/components/service-navbar";
import ClientSessionProvider from "@/components/session-provider";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function layout({
  children,
  params: { chatId },
}: {
  children: React.ReactNode;
  params: { chatId: string };
}) {
  const session = await getAuth();
  if (!session?.user) {
    redirect("/auth/login");
  }
  const userId = session.user.id as string;

  return (
    <ClientSessionProvider session={session}>
      <main className="h-screen grid grid-rows-[auto_1fr]">
        <ServiceNavbar ssr />
        <div className="flex flex-1 min-h-0">
          <Chats userId={userId} chatId={chatId} />
          {children}
        </div>
      </main>
    </ClientSessionProvider>
  );
}
