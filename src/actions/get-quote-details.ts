"use server";

import { db } from "@/lib/firebase/init";
import { QuoteDetails } from "@/types";
import { doc, getDoc } from "firebase/firestore";

// this function fetches a single message from the messages subcollection of a conversation, particularly the quote details

export async function getQuoteDetails(chatId: string, messageId: string) {
  const messageRef = doc(db, "conversations", chatId, "messages", messageId);

  const messageSnap = await getDoc(messageRef);
  if (!messageSnap.exists()) {
    throw new Error("Message not found");
  }

  const messageData = messageSnap.data();
  console.log("this is the message data content", messageData);
  // if (messageData.type !== "quote") {
  //   throw new Error("Message is not a quote");
  // }

  return messageData.content as QuoteDetails;
}
