"use client";
import ProfileDropdown from "./profile-dropdown";
import EmptyProfileDropdown from "./empty-profile-dropdown";
import { useQuery } from "@tanstack/react-query";
import { getSessionFromClient } from "@/actions/get-session-client";

export default function ProfileCSR() {
  // const session = useSession();
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => {
      return getSessionFromClient();
    },
  });
  // const { data: session, status } = useSession();
  console.log("session inside the profile CSR", session);

  // // if (session.status) return <UserIcon />;
  // // if (session.status === "unauthenticated") return <EmptyProfileDropdown />;
  // // if (!session?.data) return null;

  // // return <ProfileDropdown session={session.data} />;
  if (!session || !session?.user || isLoading) return <EmptyProfileDropdown />;
  return <ProfileDropdown session={session} />;
  return null;
}
