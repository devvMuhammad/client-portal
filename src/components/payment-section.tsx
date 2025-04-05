"use client";

import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CheckoutForm from "@/components/checkout-form";
import { useState, useTransition } from "react";
import { Separator } from "./ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { AdditionalPaymentDataType } from "@/types";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);
export default function PaymentSection({
  serviceId,
  serviceName,
  sellerId,
  prices: { service, extras, gst, total },
  additionalPaymentData,
}: {
  serviceId: string;
  serviceName: string;
  sellerId: string;
  prices: {
    service: number;
    extras: number;
    gst: number;
    total: number;
  };
  additionalPaymentData: AdditionalPaymentDataType;
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [isPending, startTransition] = useTransition();

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
    fonts: [{ cssSrc: "https://fonts.googleapis.com/css?family=Roboto" }],
  } satisfies StripeElementsOptions;

  return clientSecret ? (
    <div className="space-y-4 pt-4">
      <h1 className="text-xl md:text-2xl font-semibold">Billing Information</h1>
      <Elements options={options} stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  ) : (
    <div>
      <Card className="lg:max-w-[70%] mx-auto">
        <CardHeader>
          <CardTitle className="font-semibold text-xl">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <BillingSummary gst={gst} service={service} extras={extras} />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() =>
              startTransition(async () => {
                try {
                  const res = await fetch("/api/create-payment-intent", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      amount: total,
                      sellerId,
                      serviceId,
                      serviceName,
                      additionalPaymentData,
                    }),
                  });
                  const data = await res.json();
                  if (data.error) throw new Error(data.error.message);
                  setClientSecret(data.clientSecret);
                } catch (err: any) {
                  alert(err.message);
                  console.log(err);
                }
              })
            }
            disabled={isPending}
            size="lg"
            className="w-full bg-alphaDark"
          >
            {!isPending ? "Confirm Order" : "Processing..."}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function BillingSummary({
  gst,
  service,
  extras,
}: {
  service: number;
  extras: number;
  gst: number;
}) {
  return (
    <>
      {/* <div className="space-y-2"> */}
      {/* <h3 className="text-lg font-semibold">Summary</h3> */}
      <div className="space-y-2">
        <PaymentMetric metric="Service" amount={service} />
        <PaymentMetric metric="Extras" amount={extras} />
        {/* <PaymentMetric metric="GST" amount={gst} /> */}
      </div>
      {/* </div> */}
      <Separator className="my-4" />
      {/* @Total */}
      <div className="w-full flex justify-between">
        <h3 className="font-semibold text-lg">Total</h3>
        <p className="font-semibold text-2xl">
          {formatCurrency(service + extras)}
        </p>
      </div>
    </>
  );
}

function PaymentMetric({
  metric,
  amount,
  className,
}: {
  metric: string;
  amount: number;
  className?: string;
}) {
  return (
    <div className={cn(" w-full flex justify-between", className)}>
      <h3 className="text-muted-foreground">{metric}</h3>
      <p className="text-muted-foreground">{formatCurrency(amount)}</p>
    </div>
  );
}
