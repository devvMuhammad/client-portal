import PageContainer from "@/components/layout/page-container";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/tables/user-tables/columns";
import getUsers from "@/actions/get-users";
import { redirect } from "next/navigation";
import { protectAdminPanel } from "@/actions/protect-admin-panel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

export default async function page() {
  await protectAdminPanel();
  const data = await getUsers();
  if (data.error) {
    redirect("/auth/login");
  }

  return (
    <PageContainer>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <Heading
            title={`Users (${data.length})`}
            description="View your users here"
          />
        </div>
        <Separator />
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
        <DataTable searchKey="name" columns={columns} data={data} />
      </div>
    </PageContainer>
  );
}
