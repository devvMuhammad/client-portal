import { Session } from "next-auth";
import { UserType } from "./ChatCards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import Messages from "@/components/chat/Messages";
import Link from "next/link";

export default function ChatWindow({
  chatId,
  error,
  otherUser,
  currentUser,
}: {
  chatId: string;
  error: string | null;
  otherUser: UserType | null;
  currentUser: Session["user"];
}) {
  if (chatId === "all" || error === "Conversation not found") {
    return <ChatManagementPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (!otherUser) {
    return (
      <div className="flex-1 p-4 text-center">
        <h1 className="text-xl font-bold">Error fetching messages</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      {/* Chat Header */}
      <div className="hidden md:flex items-center border-b h-14 px-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherUser.image} />
          <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4 flex flex-col">
          <span className="font-semibold">{otherUser.name}</span>
          <span className="text-muted-foreground text-xs font-thin">
            {otherUser.email}
          </span>
        </div>
      </div>
      <Messages
        chatId={chatId}
        otherUser={otherUser as UserType}
        currentUser={currentUser}
      />
    </div>
  );
}

function ChatManagementPage() {
  return (
    <div className="flex-1 flex-col items-center mt-20 bg-background">
      <div className="text-center space-y-4">
        <div className="bg-primary rounded-full mx-auto w-24 h-24 flex items-center justify-center text-6xl text-primary-foreground">
          💬
        </div>
        <h1 className="text-3xl text-center font-bold">
          Manage Your Chats Here!
        </h1>
        <p className="text-center text-muted-foreground">
          Here is where you manage all your conversations. Select a chat and
          start chatting right away!
        </p>
      </div>
    </div>
  );
}

function ErrorPage() {
  return (
    <div className="flex flex-col items-center mt-20 bg-background">
      <div className="text-center space-y-4">
        <div className="bg-primary rounded-full mx-auto w-24 h-24 flex items-center justify-center text-6xl text-primary-foreground">
          ⚠️
        </div>
        <h1 className="text-3xl text-center font-bold">
          Oops, something went wrong!
        </h1>
        <p className="text-balance text-center text-muted-foreground max-w-md">
          We&apos;re sorry, but an unexpected error has occurred. Please try
          again later or contact support if the issue persists.
        </p>
        <Link
          href="/"
          className={`w-full max-w-[200px] ${buttonVariants({ variant: "default" })}`}
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
