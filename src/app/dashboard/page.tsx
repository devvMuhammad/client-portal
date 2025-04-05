import { BarGraph } from "@/components/charts/bar-graph";
import PageContainer from "@/components/layout/page-container";
import { RecentSales } from "@/components/dashboard/recent-sales";

import OverviewStatistics from "@/components/dashboard/overview-statistics";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function page() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
        </div>
        <Suspense
          fallback={
            // <div className="grid gap-4 grid-cols-4 h-22 bg-red-400 w-full">
            <>
              <Skeleton className="h-22 " />
              <Skeleton className="h-22 " />
              <Skeleton className="h-22 " />
              <Skeleton className="h-22 " />
            </>
            // </div>
          }
        >
          <OverviewStatistics />
        </Suspense>

        <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <BarGraph />
          </div>
          <Suspense fallback={<Skeleton />}>
            <RecentSales />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
}
