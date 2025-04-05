import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/init";
import ChatCards from "./ChatCards";
import ChatHeader from "./ChatHeader";
import { RecentChatsReturnType } from "@/types";

type TimestampType = {
  seconds: number;
  nanoseconds: number;
};

export type UserType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export async function fetchConversation(
  userId: string
): Promise<{ error: string | null; data: RecentChatsReturnType[] | null }> {
  try {
    const convCollectionRef = collection(db, "conversations");
    const q = query(
      convCollectionRef,
      where("participantIds", "array-contains", userId)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No conversations found");
      return { data: [], error: null };
    }
    return {
      data: querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as RecentChatsReturnType[],
      error: null,
    };
  } catch (error) {
    console.error("Error fetching conversations", error);
    return { error: "Error fetching conversations", data: null };
  }
}

async function fetchUserDetails(
  userIds: string[]
): Promise<{ [key: string]: UserType }> {
  const userCollectionRef = collection(db, "users");
  const userDetails: { [key: string]: UserType } = {};

  await Promise.all(
    userIds.map(async (userId) => {
      const userDoc = await getDoc(doc(userCollectionRef, userId));
      if (userDoc.exists()) {
        userDetails[userId] = { id: userId, ...userDoc.data() } as UserType;
      }
    })
  );

  return userDetails;
}

export default async function Chats({
  userId,
  chatId,
}: {
  userId: string;
  chatId: string;
}) {
  // console.log("chat id", chatId);
  const result = await fetchConversation(userId);

  if (result.error) {
    return (
      <div className="hidden w-80 min-h-0 md:flex flex-col border-r">
        <div className="bg-gray-50 flex-1 items-center justify-center overflow-y-auto">
          {/* @Logo and SearchBar*/}
          <ChatHeader />
          {/* @Recent Messages  */}
          {/* <ChatCards /> */}
          <h1 className="text-center">Error Fetching Conversations</h1>
        </div>
      </div>
    );
  }

  if (!result.data || result.data.length === 0) {
    return (
      <div className="hidden w-80 min-h-0 md:flex flex-col border-r">
        <div className="bg-gray-50 flex-1 items-center justify-center overflow-y-auto">
          {/* @Logo and SearchBar*/}
          <ChatHeader />
          {/* @Recent Messages  */}
          <h1 className="text-center">No conversations found!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden w-80 min-h-0 md:flex flex-col border-r">
      <div className="bg-gray-50 flex-1 items-center justify-center overflow-y-auto">
        {/* @Logo and SearchBar*/}
        <ChatHeader />
        {/* @Recent Messages  */}
        <ChatCards />
      </div>
    </div>
  );
}
