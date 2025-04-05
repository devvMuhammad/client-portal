"use server";

import { db } from "@/lib/firebase/init";
import { AdditionalPaymentDataType, ChatType } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { Session } from "next-auth";
import Stripe from "stripe";

// in here, we have the buyer details (whole), for the other user details, we need to fetch that from the database
export async function sendPaymentMessage({
  currentUser,
  sellerId,
  serviceId,
  serviceName,
  paymentDetails,
  additionalPaymentData,
}: {
  currentUser: Session["user"];
  sellerId: string;
  serviceId: string;
  serviceName: string;
  paymentDetails: Stripe.PaymentIntentSucceededEvent.Data["object"];
  additionalPaymentData: AdditionalPaymentDataType & {
    transactionId: string;
    amount: number;
  };
}) {
  const senderId = currentUser.id as string;

  const otherUser = await getDoc(doc(collection(db, "users"), sellerId));
  if (!otherUser.exists()) {
    throw new Error("Seller not found");
  }
  const participantIds = [senderId, otherUser.id];

  try {
    const conversationsRef = collection(db, "conversations");

    // Check if there is an existing conversation between the seller and the buyer
    const q = query(
      conversationsRef,
      where("participantIds", "==", participantIds),
      where("serviceId", "==", serviceId)
    );
    const querySnapshot = await getDocs(q);

    let conversationRef;

    if (querySnapshot.empty) {
      // If there isn't, create a new conversation
      conversationRef = doc(conversationsRef);
    } else {
      // If there is, use the existing conversation
      conversationRef = querySnapshot.docs[0].ref;
    }
    //! set the conversation document
    await setDoc(
      conversationRef,
      {
        participantIds: participantIds,
        lastMessage: `${currentUser.name || "(No Name)"} made a payment of $ ${paymentDetails.amount}`,
        lastMessageTimestamp: serverTimestamp() as any,
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
        users: [currentUser, { ...otherUser.data(), id: otherUser.id }],
        serviceId,
        serviceName,
        status: "payment",
      } as Omit<ChatType, "id">,
      { merge: true }
    );

    // !Add a message to the conversation
    const messagesRef = collection(conversationRef, "messages");
    // paymentDetails.id
    await addDoc(messagesRef, {
      content: {
        ...additionalPaymentData,
        transactionId: additionalPaymentData.transactionId,
        amount: additionalPaymentData.amount,
        // paymentDetails.
      },
      senderId: senderId,
      timestamp: serverTimestamp(),
      mediaUrl: "",
      type: "payment",
      isRead: false,
    });

    // return { success: true, id: conversationRef.id, error: null };
  } catch (error) {
    console.error("Error creating a message ", error);
    throw error;
  }
}
