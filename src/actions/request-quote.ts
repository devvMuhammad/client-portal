"use server";
import { getAuth } from "@/lib/auth";
import { db, storage } from "@/lib/firebase/init";
import { QuoteDetails, RecentChatsReturnType } from "@/types";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function requestQuoteAction({
  sellerId,
  quoteDetails,
  serviceName,
  files,
}: {
  sellerId: string;
  quoteDetails: QuoteDetails;
  serviceName: string;
  files: FormData;
}) {
  const session = await getAuth();
  if (!session) {
    return { error: "You need to be logged in to send a message" };
  }

  const senderId = session.user.id as string;
  const currentUser = session.user;

  if (sellerId === senderId) {
    return { error: "You cannot send a message to yourself" };
  }

  //! get the other user
  const otherUser = await getDoc(doc(collection(db, "users"), sellerId));
  if (!otherUser.exists()) {
    return { error: "User not found" };
  }
  const participantIds = [senderId, sellerId];

  try {
    const conversationsRef = collection(db, "conversations");

    // !Check if there is an existing conversation ON SAME SERVICE between the seller and the buyer
    const q = query(
      conversationsRef,
      where("participantIds", "==", participantIds),
      where("serviceId", "==", quoteDetails.serviceId)
    );
    const querySnapshot = await getDocs(q);

    let conversationRef;

    if (querySnapshot.empty) {
      // If there isn't, create a new conversation
      conversationRef = doc(conversationsRef);
    } else {
      // If there is, use the existing conversation
      conversationRef = querySnapshot.docs[0].ref;
      // check the status of the conversation
      const conversationData = querySnapshot.docs[0].data();
      if (
        conversationData.status === "payment" ||
        conversationData.status === "paid"
      ) {
        return { error: "You have already paid for this project!" };
      }
      /* 
      Check for the most recent quote in the conversation 
        - if it is rejected, then allow
        - if it is accepted or pending, then do not allow
      */

      //! removing this check for now
      // const messagesRef = collection(conversationRef, "messages");
      // const quoteQuery = query(
      //   messagesRef,
      //   where("type", "==", "quote"),
      //   orderBy("timestamp", "desc"),
      //   limit(1)
      // );
      // const quoteSnapshot = await getDocs(quoteQuery);
      // const mostRecentQuoteStatus = quoteSnapshot.docs[0].data().content.status;

      // if (mostRecentQuoteStatus !== "rejected") {
      //   return {
      //     error:
      //       "There is already an ongoing quote. Please settle the existing quote before requesting a new one.",
      //   };
      // }
    }

    //! set the conversation document
    await setDoc(conversationRef, {
      participantIds: participantIds,
      lastMessage: `${currentUser.name || "(No Name)"} made a quote of $ ${quoteDetails.budget}`,
      lastMessageTimestamp: serverTimestamp() as any,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      users: [currentUser, { ...otherUser.data(), id: otherUser.id }],

      //details about service
      serviceId: quoteDetails.serviceId,
      serviceName, // comes from arg
      status: "discussion",
    } satisfies Omit<RecentChatsReturnType, "id">);

    // upload the files to the firebase bucket
    const storageRef = ref(storage, `quotes/${conversationRef.id}`);
    const fileUrls = await Promise.all(
      (Array.from(files.values()) as File[]).map(async (file) => {
        const fileRef = ref(storageRef, file.name);
        const uploadResult = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(uploadResult.ref);

        return {
          url,
          metadata: {
            name: file.name,
            type: file.type,
            size: uploadResult.metadata.size,
          },
        };
      })
    );

    console.log(fileUrls);

    // Add a message to the conversation
    const messagesRef = collection(conversationRef, "messages");
    await addDoc(messagesRef, {
      content: { ...quoteDetails, files: fileUrls } satisfies QuoteDetails,
      senderId: senderId,
      timestamp: serverTimestamp(),
      mediaUrl: "",
      type: "quote",
      isRead: false,
      settled: false,
    });

    return { success: true, id: conversationRef.id, error: null };
  } catch (error) {
    console.error("Error creating a message ", error);
    return { error: "Error creating a message" };
  }
}
