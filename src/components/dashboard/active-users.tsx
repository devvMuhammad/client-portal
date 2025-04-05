"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "../icons";
import useRealtimePresence from "@/app/chats/[chatId]/useRealtimePresence";
import { Skeleton } from "../ui/skeleton";

export default function ActiveUsers() {
  const { data: users, isPending, isError } = useRealtimePresence();

  if (isPending) return <Skeleton className="h-22" />;
  if (isError || !users) return <div>Error</div>;

  const activeUsers = Object.entries(users).reduce(
    (acc: number, key: [string, { online: boolean }]) => {
      if (key[1].online) {
        acc++;
      }
      return acc;
    },
    0
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
        <Icons.reviews />
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-10" />
        ) : (
          <div className="text-2xl font-bold">
            {activeUsers - 1 < 0 ? 0 : activeUsers - 1}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
