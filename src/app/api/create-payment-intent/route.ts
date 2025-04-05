import { getAuth } from "@/lib/auth";
import { db } from "@/lib/firebase/init";
import { AdditionalPaymentDataSchema } from "@/lib/schema";
import { AdditionalPaymentDataType } from "@/types";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// This is your test secret API key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { amount, sellerId, serviceId, serviceName, additionalPaymentData } =
    await req.json();

  //! zod validation later
  // const { error, data: parsedAdditionalPaymentData } =
  //   AdditionalPaymentDataSchema.safeParse(additionalPaymentData);

  // if (error) {
  //   return NextResponse.json(
  //     { error: { message: error.errors } },
  //     { status: 400 }
  //   );
  // }

  try {
    // some important checks
    const session = await getAuth();
    if (!session) {
      return NextResponse.json(
        { error: { message: "You need to be logged in to make a payment" } },
        { status: 400 }
      );
    }

    // check for user status
    const { user } = session;
    if (user.status === "seller" || user.status === "admin") {
      return NextResponse.json(
        {
          error: { message: "You cannot make a payment as a seller or admin" },
        },
        { status: 400 }
      );
    }

    // check payments collection if there is a payment already made
    const paymentsRef = collection(db, "payments");
    const q = query(
      paymentsRef,
      where("buyerId", "==", user.id as string),
      where("serviceId", "==", serviceId)
    );
    const paymentsSnapshot = await getDocs(q);

    if (!paymentsSnapshot.empty) {
      return NextResponse.json(
        {
          error: {
            message:
              "You have already made a payment, please wait for approval",
          },
        },
        { status: 400 }
      );
    }

    if (!amount || !sellerId) {
      return NextResponse.json(
        { error: { message: "Amount and sellerId are required" } },
        { status: 400 }
      );
    }

    //! store them in a collection and get their ids
    // let additionalPaymentMetaData
    const paymentsMetaRef = collection(db, "paymentsMetadata");
    const additionalPaymentMetaDataRef = await addDoc(paymentsMetaRef, {
      buyerId: user.id as string,
      sellerId,
      serviceId, // no need to store serviceName in metadataRef collection
      type: (additionalPaymentData as AdditionalPaymentDataType).type,
      data: additionalPaymentData.data,
    });

    const additionalPaymentMetaDataId = additionalPaymentMetaDataRef.id;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        buyer_details: JSON.stringify(user),
        buyerId: user.id as string,
        sellerId,
        serviceId,
        serviceName,
        paymentMetadataId: additionalPaymentMetaDataId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("Stripe intent internal error", err);
    return NextResponse.json(
      { error: { message: "Stripe intent internal error" } },
      { status: 500 }
    );
  }
}
