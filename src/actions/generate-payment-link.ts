"use server";
import { BasicQuoteDetailsType, CheckoutPageDataType } from "@/types";
import { createCipheriv, randomBytes, createHash } from "crypto";

export async function generatePaymentLinkForQuote(
  dataForQuoteCheckoutPage: Extract<CheckoutPageDataType, { type: "quote" }>
) {
  const secret = process.env.NEXTAUTH_SECRET;

  // Derive a 32-byte key from the secret
  const key = createHash("sha256")
    .update(String(secret))
    .digest("hex")
    .slice(0, 32);

  const iv = randomBytes(16);
  const jsonData = JSON.stringify(dataForQuoteCheckoutPage);

  // Use the derived key instead of the secret directly
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(jsonData, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `/service/checkout?data=${encrypted}&iv=${iv.toString("hex")}`;
}

export async function generatePaymentLinkForUpfront(
  dataForQuoteCheckoutPage: Extract<CheckoutPageDataType, { type: "upfront" }>
) {
  const secret = process.env.NEXTAUTH_SECRET;

  // Derive a 32-byte key from the secret
  const key = createHash("sha256")
    .update(String(secret))
    .digest("hex")
    .slice(0, 32);

  const iv = randomBytes(16);
  const jsonData = JSON.stringify(dataForQuoteCheckoutPage);

  // Use the derived key instead of the secret directly
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(jsonData, "utf8", "hex");
  encrypted += cipher.final("hex");

  return `/service/checkout?data=${encrypted}&iv=${iv.toString("hex")}`;
}
