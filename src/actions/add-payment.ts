"use server";

import { db } from "@/lib/firebase/init";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";

export async function addPayment({
  buyerId,
  sellerId,
  serviceId,
  paymentDetails,
  paymentMetadata,
}: {
  buyerId: string;
  sellerId: string;
  serviceId: string;
  paymentDetails: any;
  paymentMetadata: any;
}) {
  // add payment to firebase payments collection
  try {
    const payment = await setDoc(doc(collection(db, "payments")), {
      buyerId,
      sellerId,
      serviceId,
      paymentDetails,
      paymentMetadata,
      status: "project_ongoing",
      createdAt: serverTimestamp(),
    });
    return payment;
  } catch (err) {
    console.error("Error adding payment: ", err);
    return { error: "Error adding payment" };
  }
}
