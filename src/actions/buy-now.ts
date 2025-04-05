"use server";
import { getAuth } from "@/lib/auth";
import { CheckoutPageDataType } from "@/types";
import { redirect } from "next/navigation";
import { generatePaymentLinkForUpfront } from "./generate-payment-link";

export async function buyNow(
  data: Extract<CheckoutPageDataType, { type: "upfront" }>
) {
  const session = await getAuth();
  if (!session) {
    throw new Error("You must be logged in to pay for the service");
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }

  const paymentLink = await generatePaymentLinkForUpfront(data);

  redirect(paymentLink);
}
