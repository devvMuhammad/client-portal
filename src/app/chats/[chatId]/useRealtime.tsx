import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  collection,
  query,
  where,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
  Query,
  FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase/init";
import { RecentChatsReturnType } from "@/types";

type UseRealtimeChatsOptions = {
  onError?: (error: FirestoreError) => void;
};

function useRealtimeChats(
  userId: string,
  options: UseRealtimeChatsOptions = {}
): UseQueryResult<RecentChatsReturnType[], FirestoreError> {
  const queryClient = useQueryClient();
  const queryKey = ["chats", userId];

  useEffect(() => {
    const convCollectionRef = collection(db, "conversations");
    const q: Query<DocumentData> = query(
      convCollectionRef,
      where("participantIds", "array-contains", userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot: QuerySnapshot<DocumentData>) => {
        const updatedChats = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as Omit<RecentChatsReturnType, "id">),
          id: doc.id,
        }));

        queryClient.setQueryData(queryKey, updatedChats);
      },
      (error: FirestoreError) => {
        if (options.onError) {
          options.onError(error);
        }
      }
    );

    return () => unsubscribe();
  }, [queryClient, userId]);

  return useQuery<RecentChatsReturnType[], FirestoreError>({
    queryKey,
    queryFn: () => new Promise(() => {}), // This won't be called due to the realtime updates
    staleTime: Infinity, // Prevent refetching since we're using realtime updates
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export default useRealtimeChats;
