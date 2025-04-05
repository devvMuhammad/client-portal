"use client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import {
  formatLastSeen,
  formatRecentChatTimestamp,
  formatTimestamp,
} from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import useRealtimeChats from "@/app/chats/[chatId]/useRealtime";
import { Skeleton } from "../ui/skeleton";
import useRealtimePresence from "@/app/chats/[chatId]/useRealtimePresence";

type TimestampType = {
  seconds: number;
  nanoseconds: number;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export default function ChatCards() {
  const { chatId } = useParams();
  const userId = useSession().data?.user.id as string;
  const {
    data: chats,
    isLoading,
    error,
  } = useRealtimeChats(userId, {
    onError: (error) => {
      console.error("Error fetching chats:", error);
      // You could also show a toast notification here
    },
  });

  const { data: presenceData } = useRealtimePresence({
    onError: (error) => {
      console.error("Error fetching presence:", error);
      // You could also show a toast
    },
  });
  console.log(presenceData);

  if (error) return <div>Error loading chats: {error.message}</div>;
  if (isLoading)
    return (
      <div className="overflow-y-auto space-y-3 px-4">
        <Skeleton className="w-full h-24 bg-zinc-300" />
        <Skeleton className="w-full h-24 bg-zinc-300" />
        <Skeleton className="w-full h-24 bg-zinc-300" />
        <Skeleton className="w-full h-24 bg-zinc-300" />
      </div>
    );

  console.log("rendering");
  console.log(chats);

  return (
    <div className="overflow-y-auto space-y-2 px-4">
      {chats?.map((chat) => {
        const otherUser = chat.users.find(
          (user) => user.id !== userId
        ) as UserType;
        const presenceStatus =
          presenceData && presenceData[otherUser.id as string]?.online;
        const lastSeen =
          presenceData && presenceData[otherUser.id as string]?.lastActive;
        return (
          <div
            key={chat.id}
            className={`p-4 ${chat.id === chatId && "bg-gray-200"} group hover:bg-gray-200 cursor-pointer transition-all duration-150 ease rounded-xl grid grid-cols-[auto_1fr] gap-4 items-center`}
          >
            <div className="relative">
              <Avatar>
                {otherUser.image ? (
                  <AvatarImage
                    className="rounded-full"
                    alt="Picture"
                    src={otherUser.image}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <AvatarFallback>
                    <span className="sr-only">{otherUser.name}</span>
                    <User className=" h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div
                className={`absolute right-0 bottom-0 ${presenceStatus ? "bg-green-600" : "bg-gray-500"} h-3 w-3 rounded-full z-100`}
              ></div>
            </div>
            <div className="flex flex-col min-w-0">
              <div className={`w-full grid grid-cols-[auto_1fr] items-center `}>
                <Link
                  href={`/chats/${chat.id}`}
                  onClick={() => {
                    console.log(chat.id, chatId);
                  }}
                  className="font-bold truncate mr-2"
                >
                  {otherUser.name}
                </Link>
                <p className="text-xs whitespace-nowrap">
                  {chat.updatedAt?.seconds &&
                    formatRecentChatTimestamp(chat.updatedAt.seconds)}
                </p>
              </div>
              <p className="text-sm mb-1 font-semibold truncate">
                {chat.serviceName}
              </p>
              <p
                className={`text-sm text-muted-foreground truncate ${chat.id === chatId && "text-muted-foreground"}`}
              >
                {chat.lastMessage}
              </p>
              <p
                className={`text-xs text-right text-muted-foreground truncate ${chat.id === chatId && "text-muted-foreground"}`}
              >
                {presenceStatus && formatLastSeen(lastSeen)
                  ? "Active"
                  : formatLastSeen(lastSeen + 1)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
