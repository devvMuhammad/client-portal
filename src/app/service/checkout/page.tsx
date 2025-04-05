import { decryptData } from "@/actions/decrypt-data";
import PaymentSection from "@/components/payment-section";
import QuotePaymentDetails from "@/components/payment/QuotePaymentDetails";
import UpfrontPaymentDetails from "@/components/payment/UpfrontPaymentDetails";
import { getAuth } from "@/lib/auth";
import { CheckoutPageDataType } from "@/types";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout Page",
};

const SELLER_ID = process.env.SELLER_ID!;
if (!SELLER_ID) {
  redirect("/");
}
export default async function CheckoutPage({
  searchParams: { data: encryptedData, iv },
}: {
  searchParams: { data: string; iv: string };
}) {
  const session = await getAuth();
  if (!session?.user) {
    redirect("/login");
  }

  let decryptedData: CheckoutPageDataType;
  try {
    decryptedData = (await decryptData(
      encryptedData,
      iv
    )) as CheckoutPageDataType;
  } catch (err) {
    console.error("Failed to decrypt data:", err);
    redirect("/services");
  }

  // return <pre>{JSON.stringify(decryptedData, null, 2)}</pre>;

  const { serviceId, serviceName, type, data } = decryptedData;

  if (type === "quote") {
    return renderQuotePayment(serviceName, serviceId, data);
  } else if (type === "upfront") {
    return renderUpfrontPayment(serviceName, serviceId, data);
  } else {
    console.error("Invalid payment type:", type);
    redirect("/chats/all");
  }
}

function renderQuotePayment(
  serviceName: string,
  serviceId: string,
  quoteData: any
) {
  const {
    budget: basePrice,
    description: quoteDescription,
    delivery,
  } = quoteData;
  // const gst = calculateGST(basePrice);
  const total = calculateTotal(basePrice, 0);

  return (
    <section className="px-10 py-10 grid lg:grid-cols-2 gap-8">
      <QuotePaymentDetails
        serviceName={serviceName}
        basePrice={basePrice}
        quoteDescription={quoteDescription}
        delivery={delivery}
      />
      <PaymentSection
        sellerId={SELLER_ID}
        serviceId={serviceId}
        serviceName={serviceName}
        prices={{ service: basePrice, extras: 0, gst: 0, total }}
        additionalPaymentData={{
          type: "quote",
          // this is what is going to be stored in the database for the quote
          data: {
            serviceId,
            serviceName,
            quoteDetails: {
              budget: basePrice,
              description: quoteDescription,
              delivery,
            },
          },
        }}
      />
    </section>
  );
}

function renderUpfrontPayment(
  serviceName: string,
  serviceId: string,
  upfrontData: Extract<CheckoutPageDataType, { type: "upfront" }>["data"]
) {
  const {
    package: { price: servicePrice, title, features },
    baseQuantity,
    selectedUpsells,
  } = upfrontData;

  const basePrice = servicePrice * baseQuantity;
  const upsellsPrice = calculateUpsellsPrice(selectedUpsells);
  // const gst = calculateGST(basePrice + upsellsPrice);
  const totalPrice = calculateTotal(basePrice + upsellsPrice, 0);

  return (
    <section className="px-10 py-10 grid lg:grid-cols-2 gap-8">
      <UpfrontPaymentDetails
        serviceName={serviceName}
        title={title}
        baseQuantity={baseQuantity}
        basePrice={basePrice}
        servicePrice={servicePrice}
        features={features}
        selectedUpsells={selectedUpsells}
      />
      <PaymentSection
        sellerId={SELLER_ID}
        serviceId={serviceId}
        serviceName={serviceName}
        prices={{
          service: basePrice,
          extras: upsellsPrice,
          gst: 0,
          total: totalPrice,
        }}
        // this is what is going to be stored in the database for the upfront payment
        additionalPaymentData={{
          type: "upfront",
          data: {
            packageType: title,
            baseQuantity,
            package: { price: servicePrice, title, features },
            selectedUpsells,
          },
        }}
      />
    </section>
  );
}

// function calculateGST(amount: number): number {
//   return Number((amount * 0.1).toFixed(2));
// }

function calculateTotal(amount: number, gst: number): number {
  return Number((amount + gst).toFixed(2));
}

function calculateUpsellsPrice(selectedUpsells: any[]): number {
  return selectedUpsells.reduce((acc, upsell) => acc + upsell.price, 0);
}
