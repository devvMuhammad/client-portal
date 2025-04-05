"use server";

import { db } from "@/lib/firebase/init";
import { Review } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function getReviews(serviceId: string) {
  const paymentsRef = collection(db, "reviews");
  const paymentQuery = query(paymentsRef, where("serviceId", "==", serviceId));
  const paymentSnapshot = await getDocs(paymentQuery);

  return paymentSnapshot.docs.map((doc) => ({ ...doc.data() })) as Review[];
}
