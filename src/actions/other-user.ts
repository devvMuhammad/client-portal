"use server";
import { UserType } from "@/components/chat/ChatCards";
import { db } from "@/lib/firebase/init";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { cache } from "react";

export const getOtherUser = cache(
  async (conversationId: string, currentUserId: string) => {
    try {
      // Fetch the conversation document to get participant IDs
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        return { otherUser: null, error: "Conversation not found" };
      }

      const conversationData = conversationSnap.data();
      const participantIds = conversationData.participantIds || [];

      // Find the other user (not the current user)
      const otherUserId = participantIds.find(
        (id: string) => id !== currentUserId
      );
      const otherUserRef = doc(db, "users", otherUserId);
      const otherUserSnap = await getDoc(otherUserRef);

      if (!otherUserSnap.exists()) {
        return { otherUser: null, error: "User not found" };
      }

      const otherUser = {
        ...otherUserSnap.data(),
        id: otherUserSnap.id,
      } as UserType;

      return { otherUser, error: null };
    } catch (error) {
      console.error("Error fetching messages and user details:", error);
      return { otherUser: null, error: "Error fetching user details" };
    }
  }
);
