"use client";

import { getSessionFromClient } from "@/actions/get-session-client";
import { getAuth } from "@/lib/auth";
import { realtimeDb } from "@/lib/firebase/init";
import { useQuery } from "@tanstack/react-query";
import {
  DatabaseReference,
  off,
  onDisconnect,
  onValue,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import { useEffect } from "react";

export default function PresenceListener() {
  const { data: session, isLoading } = useQuery({
    queryKey: ["session"],
    queryFn: () => {
      return getSessionFromClient();
    },
  });
  // const { data: session, status } = useSession();
  console.log("LOADING STATE", isLoading);
  console.log("SESSION INSIDE THE PRESENCE LISTENER", session);

  useEffect(() => {
    let presenceRef: DatabaseReference;

    const updatePresence = (online: boolean) => {
      if (presenceRef) {
        set(presenceRef, { online, lastActive: serverTimestamp() });
      }
    };

    if (session?.user?.id) {
      presenceRef = ref(realtimeDb, "/presence/" + session.user.id);

      // Set up online/offline detection
      const onlineRef = ref(realtimeDb, ".info/connected");
      const unsubscribe = onValue(onlineRef, (snapshot) => {
        const isConnected = snapshot.val();
        if (isConnected) {
          updatePresence(true);
          onDisconnect(presenceRef).set({
            online: false,
            lastActive: serverTimestamp(),
          });
        } else {
          updatePresence(false);
        }
      });

      return () => {
        unsubscribe();
        updatePresence(false);
        off(presenceRef);
      };
    }
  }, [isLoading, session?.user?.id]);

  return null;
}
