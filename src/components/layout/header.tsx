import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import ProfileDropdown from "../profile-dropdown";
import { protectAdminPanel } from "@/actions/protect-admin-panel";

export default async function Header() {
  const session = await protectAdminPanel();
  return (
    <header className="border-b sticky inset-x-0 top-0 w-full">
      <nav className="flex items-center justify-between px-4 py-2">
        <h1 className="self-end text-2xl font-bold hidden lg:block ml-4">
          Admin Dashboard
        </h1>
        {/* <Heading title="Admin Dashboard"/> */}
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2">
          <ProfileDropdown session={session} />
        </div>
      </nav>
    </header>
  );
}
