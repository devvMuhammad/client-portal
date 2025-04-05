import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";

export default function EmptyProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback>
            {/* <span className="sr-only">{session?.user.name}</span> */}
            <User className=" h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-[0.25rem] overflow-y-auto"
      >
        <div className="flex items-center justify-start gap-2 p-2">
          You are not Logged In
        </div>
        <DropdownMenuSeparator />
        {/* <pre>{JSON.stringify(props.data, null, 2)}</pre> */}
        <DropdownMenuItem
          className="cursor-pointer rounded-[0.25rem] p-2"
          // onSelect={(e) => {
          //   // router
          // }}
          asChild
        >
          <Link href="/auth/login">Login</Link>
          {/* {isPending ? "Logging out" : "Logout"} */}
          {/* Login */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
