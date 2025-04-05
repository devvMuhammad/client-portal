"use server";

import { db } from "@/lib/firebase/init";
import { PaymentDataType } from "@/types";
import { collection, getDocs, query } from "firebase/firestore";
import { cache } from "react";

async function getPayments() {
  const paymentsRef = collection(db, "payments");
  const paymentsSnapshot = await getDocs(query(paymentsRef));

  // transactionId, buyerName, buyerEmail, amount, payment type (quote | upfront), transaction date

  // what to show in table
  // transactionId
  // buyerDetails -> {name, email}
  // amount
  // date
  // button for viewing payment details in a dialog

  return paymentsSnapshot.docs.map((doc) => ({
    // ...doc.data(),
    transactionId: doc.data().paymentDetails.id,
    buyerDetails: JSON.parse(doc.data().paymentDetails.metadata.buyer_details),
    amount: doc.data().paymentDetails.amount / 100,
    createdAt: doc.data().createdAt.seconds,
    paymentMetadetails: doc.data().paymentMetadata,
  })) as PaymentDataType[];
}

export default cache(getPayments);
