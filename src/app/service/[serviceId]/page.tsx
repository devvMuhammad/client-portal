import React from "react";
import PricingPlans from "@/components/service/pricing-plans";
import ServiceDescription from "@/components/service/service-description";
import PackageComparison from "@/components/service/package-comparison";
import FAQSection from "@/components/service/faq";
import RelatedTags from "@/components/service/related-tags";
import { client } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { redirect } from "next/navigation";
import Reviews from "@/components/service/reviews";
import { Metadata } from "next";
import { REVALIDATE_TIME_PERIOD } from "@/config/data";

export const revalidate = REVALIDATE_TIME_PERIOD;

export const metadata: Metadata = {
  title: "Service Description",
};

export async function generateStaticParams() {
  const services = groq`*[_type == "service"]{ _id }`;
  const data = (await client.fetch(services)) as {
    _id: string;
  }[];
  return data.map((service) => ({
    params: { serviceId: service._id },
  }));
}

// Main component
export default async function ServicePage({
  params: { serviceId },
}: {
  params: { serviceId: string };
}) {
  //! when implementing the backend, we will have access to the seller details
  const sellerId = process.env.SELLER_ID!;
  if (!sellerId) {
    redirect("/");
  }

  const serviceQuery = groq`*[_type == "service" && _id == $id]{_id,name,serviceIntroduction,offers,description,packages,upsells,faqs,tags}`;
  const serviceData = await client.fetch(serviceQuery, { id: serviceId });

  if (serviceData.length === 0 || !serviceData[0]) {
    redirect("/services");
  }
  const {
    // _id: ser,
    name: serviceName,
    serviceIntroduction,
    offers,
    description,
    packages,
    upsells,
    faqs,
    tags,
  } = serviceData[0];

  console.log(serviceId);
  return (
    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto py-12 px-4 md:px-6">
      {/* (Description, Package Comparision, FAQs, TAGs) - Left Side */}
      <div className="flex flex-col gap-8">
        <ServiceDescription
          name={serviceName}
          serviceIntroduction={serviceIntroduction}
          offers={offers}
          description={description}
        />
        <PackageComparison packages={packages} />
        <FAQSection faqs={faqs} />
        <Reviews
          // reviews={reviewsData}
          serviceId={serviceId}
          serviceName={serviceName}
        />
        <RelatedTags tags={tags} />
      </div>

      {/* @Pricing Tab - Right Side */}
      <PricingPlans
        serviceId={serviceId}
        serviceName={serviceName}
        upsells={upsells}
        packages={packages}
        sellerId={sellerId}
      />
    </div>
  );
}
