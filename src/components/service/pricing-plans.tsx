"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PackageType, Packages, Upsell } from "@/types";
import { useState } from "react";
import PricingCard from "./pricing-card";

export default function PricingPlans({
  serviceId,
  serviceName,
  packages,
  sellerId,
  upsells,
}: {
  serviceId: string;
  serviceName: string;
  packages: Packages;
  sellerId: string;
  upsells: Upsell[];
}): React.ReactElement {
  const [activeTab, setActiveTab] = useState<PackageType>("basic");

  return (
    <div className="grid gap-4">
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as PackageType)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="standard">Standard</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>
        {/* @Renders the three Packages - Start, Intermediate, Premium */}
        {Object.entries(packages).map(([key, pack]) => (
          <TabsContent key={key} value={key}>
            <PricingCard
              serviceName={serviceName}
              serviceId={serviceId}
              currentPackageType={key as PackageType}
              currentPackage={pack}
              sellerDetails={{
                name: "Jez Kez",
                id: sellerId,
                address: "Melbourne, Australia",
              }}
              upsells={upsells}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
