import { getAuth } from "@/lib/auth";
import ProfileDropdown from "./profile-dropdown";
import EmptyProfileDropdown from "./empty-profile-dropdown";

export default async function ProfileSSR() {
  const session = await getAuth();
  if (!session) return <EmptyProfileDropdown />;

  return <ProfileDropdown session={session} />;
}
