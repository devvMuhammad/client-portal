import PageContainer from "@/components/layout/page-container";
import { Heading } from "@/components/ui/heading";
import { Loader2 } from "lucide-react";

export default function LoadingPage() {
  return (
    <PageContainer>
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <Heading
            title={`Payments`}
            description="Check out all your payments here"
          />
        </div>
        {/* <DataTable columns={columns} data={data} /> */}
        <div className="max-h-[calc(80vh-220px)] flex items-center justify-center md:max-h-[calc(80dvh-200px)]">
          <Loader2 className="h-20 w-20 animate-spin" />
        </div>
      </div>
    </PageContainer>
  );
}
