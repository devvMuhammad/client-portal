"use server";

import { UserType } from "@/components/chat/ChatCards";
import { getAuth } from "@/lib/auth";
import { db } from "@/lib/firebase/init";
import { RecentChatsReturnType } from "@/types";
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
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";

export async function startConversation(
  sellerId: string,
  message: string,
  serviceId: string,
  serviceName: string
) {
  const session = await getAuth();
  if (!session) {
    redirect("/auth/login");
  }

  // console.log("session inside the action", session);
  const senderId = session.user.id as string;
  const currentUser = session.user;
  const otherUser = await getDoc(doc(collection(db, "users"), sellerId));
  if (!otherUser.exists()) {
    return { error: "User not found" };
  }
  const participantIds = [senderId, sellerId];
  let conversationId: string = "";

  try {
    // Create a new conversation document
    const conversationsRef = collection(db, "conversations");
    // first check if a converstation already exists between the two participants
    const q = query(
      conversationsRef,
      where("participantIds", "==", participantIds),
      where("serviceId", "==", serviceId)
    );
    const querySnapshopt = await getDocs(q);

    // if not, redirect to the chat
    if (!querySnapshopt.empty) {
      conversationId = querySnapshopt.docs[0].id;
      redirect(`/chats/${conversationId}`);
      // return { id: conversationId, error: null };
      // console.log("this is freaking conversation id", conversationId);
      // redirect(`/chats/${conversationId}`);
      // return { error: null };
    }

    const newConversationRef = doc(conversationsRef);

    await setDoc(newConversationRef, {
      participantIds: participantIds,
      lastMessage: message,
      lastMessageTimestamp: serverTimestamp() as any,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      users: [
        currentUser,
        { ...otherUser.data(), id: otherUser.id },
      ] as UserType[],

      //details about service
      serviceId,
      serviceName, // comes from arg
      status: "discussion",
    } satisfies Partial<RecentChatsReturnType>);

    // Add the initial message to the messages subcollection
    const messagesRef = collection(newConversationRef, "messages");
    await addDoc(messagesRef, {
      content: message,
      senderId: participantIds[0], // Assuming the first participant is the sender
      timestamp: serverTimestamp(),
      mediaUrl: "",
      type: "text",
      isRead: false,
    });
    conversationId = newConversationRef.id;
    redirect(`/chats/${conversationId}`);
    // The conversation document is already up to date, so we don't need to update it again
    // return { id: conversationId, error: null }; // Return the new conversation ID
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error("Error creating a message ", error);
    // throw error;
    return { error: "Error creating a message" };
  }
}
