import { addPayment } from "@/actions/add-payment";
import { sendPaymentMessage } from "@/actions/payment-message";
import { db } from "@/lib/firebase/init";
import { AdditionalPaymentDataType } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!webhookSecret || !stripeSecret) {
  throw new Error("Missing Stripe environment variables");
}

const stripe = new Stripe(stripeSecret!);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("Stripe-Signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret!
    );

    if (event.type === "payment_intent.succeeded") {
      console.log("Payment intent succeeded:", event.type);
      const currentUser = JSON.parse(event.data.object.metadata.buyer_details);
      const sellerId = event.data.object.metadata.sellerId;
      const serviceId = event.data.object.metadata.serviceId;
      const serviceName = event.data.object.metadata.serviceName;
      const buyerId = event.data.object.metadata.buyerId;
      const paymentMetadataId = event.data.object.metadata.paymentMetadataId;

      const additionalPaymentSnapshot = await getDoc(
        doc(db, "paymentsMetadata", paymentMetadataId)
      );
      if (!additionalPaymentSnapshot.exists()) {
        return NextResponse.json(
          { error: "Additional payment data not found" },
          { status: 404 }
        );
      }

      const additionalPaymentData = {
        type: additionalPaymentSnapshot.data().type,
        data: additionalPaymentSnapshot.data().data,
      } as AdditionalPaymentDataType;

      try {
        await Promise.all([
          addPayment({
            buyerId,
            sellerId,
            serviceId,
            paymentMetadata: additionalPaymentData,
            paymentDetails: { ...event.data.object },
          }),
          sendPaymentMessage({
            currentUser,
            sellerId,
            serviceId,
            serviceName,
            paymentDetails: { ...event.data.object },
            additionalPaymentData: {
              ...additionalPaymentData,
              transactionId: paymentMetadataId,
              amount: event.data.object.amount,
            },
          }),
        ]);

        console.log(
          "Payment added to Firebase and message sent to conversation"
        );
        return NextResponse.json({ status: "success", event: event.type });
      } catch (error) {
        console.error("Error in payment processing:", error);
        return NextResponse.json(
          { error: "Payment processing failed" },
          { status: 500 }
        );
      }
    } else {
      // Handle or log other event types as needed
      console.log("Unhandled event type:", event.type);
      return NextResponse.json({ status: "received", event: event.type });
    }
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    if (err instanceof stripe.errors.StripeSignatureVerificationError) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
