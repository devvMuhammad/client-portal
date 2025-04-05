"use client";
import { useEffect } from "react";
import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { FirestoreError } from "firebase/firestore";
import { realtimeDb } from "@/lib/firebase/init";
import { onValue, ref } from "firebase/database";

type UseRealtimeChatsOptions = {
  onError?: (error: FirestoreError) => void;
};

type PresenceDataType = {
  [key: string]: {
    online: boolean;
    lastActive: any;
  };
};

function useRealtimePresence(
  options: UseRealtimeChatsOptions = {}
): UseQueryResult<PresenceDataType, FirestoreError> {
  const queryClient = useQueryClient();
  const queryKey = ["presence"];

  useEffect(() => {
    const presenceRef = ref(realtimeDb, "/presence");
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      queryClient.setQueryData(queryKey, snapshot.toJSON());
    });
    return () => {
      unsubscribe();
    };
  }, [queryClient]);

  return useQuery<PresenceDataType, FirestoreError>({
    queryKey,
    queryFn: () => new Promise(() => {}), // This won't be called due to the realtime updates
    staleTime: Infinity, // Prevent refetching since we're using realtime updates
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    ...options,
  });
}

export default useRealtimePresence;
