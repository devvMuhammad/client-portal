import PageContainer from "@/components/layout/page-container";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns } from "@/components/tables/payment-table/columns";
import { protectAdminPanel } from "@/actions/protect-admin-panel";
import getPayments from "@/actions/get-payments";
import { PaymentDataType } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments",
};

export default async function page() {
  await protectAdminPanel();
  const data = (await getPayments()) as PaymentDataType[];

  return (
    <PageContainer>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <Heading
            title={`Payments (${data.length})`}
            description="Check out all your payments here"
          />
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </PageContainer>
  );
}
