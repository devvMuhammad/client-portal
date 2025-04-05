"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ref, serverTimestamp, set } from "firebase/database";
import { useTransition } from "react";
import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, User } from "lucide-react";
import { signOutAction } from "@/actions/signOut";
import Link from "next/link";
import { realtimeDb } from "@/lib/firebase/init";
import { useQueryClient } from "@tanstack/react-query";

export default function ProfileDropdown({ session }: { session: Session }) {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  // console.log("session inside the profile dropdown client side", session);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* {session?.user ? } */}
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={session.user?.image ?? ""}
            alt={session.user?.name ?? ""}
          />
          <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[0.25rem] overflow-y-auto"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          <Avatar>
            {session.user.image ? (
              <AvatarImage alt="Picture" src={session.user.image} />
            ) : (
              <AvatarFallback>
                <span className="sr-only">{session?.user.name}</span>
                <User className=" h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{session?.user.name as string}</p>
            {/* && ( */}
            <p className="w-[250px] truncate text-sm text-muted-foreground">
              {session?.user.status === "seller"
                ? "Seller"
                : ("Buyer" as string)}
            </p>
          </div>
        </div>
        {session && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/chats/all">Chats</Link>
          </DropdownMenuItem>
        )}
        {session.user.status === "seller" && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/studio">Content</Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        {/* <pre>{JSON.stringify(props.data, null, 2)}</pre> */}
        <DropdownMenuItem
          className="cursor-pointer rounded-[0.25rem] p-2"
          onSelect={(e) => {
            e.preventDefault();
            startTransition(async () => {
              await signOutAction();

              const presenceRef = ref(
                realtimeDb,
                "/presence/" + session?.user.id
              );
              // set status to offline when user is logged out
              set(presenceRef, {
                online: false,
                lastActive: serverTimestamp(),
              });
              queryClient.invalidateQueries({ queryKey: ["session"] });
              // router.push("/");
            });
          }}
        >
          <LogOut className="mr-2" />
          {isPending ? "Logging out" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
