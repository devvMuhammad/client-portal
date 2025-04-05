"use client";
// useRealtimeMessages.ts
import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Query,
  FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase/init";
import { MessageType } from "@/types/index";

type UseRealtimeMessagesOptions = {
  onError?: (error: FirestoreError) => void;
};

function useRealtimeMessages(
  chatId: string,
  options: UseRealtimeMessagesOptions = {}
): UseQueryResult<MessageType[], FirestoreError> {
  const queryClient = useQueryClient();
  const queryKey = ["messages", chatId];

  useEffect(() => {
    const messagesRef = collection(db, "conversations", chatId, "messages");
    const q: Query<DocumentData> = query(
      messagesRef,
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const updatedMessages = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<MessageType, "id">),
          id: doc.id,
        }));

        queryClient.setQueryData(queryKey, updatedMessages);
      },
      (error: FirestoreError) => {
        if (options.onError) {
          options.onError(error);
        }
      }
    );

    return () => unsubscribe();
  }, [chatId, queryClient]);

  return useQuery<MessageType[], FirestoreError>({
    queryKey,
    queryFn: () => new Promise(() => {}), // This won't be called due to the realtime updates
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export default useRealtimeMessages;
