"use client";

import { Loader2, PaperclipIcon, SendIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRef, useEffect } from "react";
import { MessageType, QuoteDetails } from "@/types/index";
import { db } from "@/lib/firebase/init";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { UserType } from "./Chats";
import { Session } from "next-auth";
import Message from "./Message";
import useRealtimeMessages from "@/app/chats/[chatId]/useMessages";
import { generatePaymentLinkForQuote } from "@/actions/generate-payment-link";
import { Textarea } from "../ui/textarea";

export default function Messages({
  chatId,
  otherUser,
  currentUser,
}: {
  chatId: string;
  otherUser: UserType;
  currentUser: Session["user"];
}) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const {
    data: messages,
    isLoading,
    error,
  } = useRealtimeMessages(chatId, {
    onError: (error) => {
      console.error("Error fetching messages:", error);
      // You could also show a toast notification here
    },
  });

  async function sendMessage(message: string) {
    const messagesRef = collection(db, "conversations", chatId, "messages");

    try {
      await addDoc(messagesRef, {
        senderId: currentUserId,
        content: message,
        timestamp: serverTimestamp(),
        mediaUrl: "",
        type: "text",
        isRead: false,
      });

      console.log("Message sent successfully");

      const conversationRef = doc(db, "conversations", chatId);
      await setDoc(
        conversationRef,
        {
          lastMessage: message,
          updatedAt: serverTimestamp() as any,
          lastMessageTimestamp: serverTimestamp() as any,
          users: [currentUser, otherUser],
        },
        { merge: true }
      );

      console.log("recent message updated successfully");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }

  async function sendQuoteMessage(messageContent: {
    accepted: boolean;
    paymentLink: string | null;
    quoteId: string;
  }) {
    const messagesRef = collection(db, "conversations", chatId, "messages");

    try {
      await addDoc(messagesRef, {
        senderId: currentUserId,
        content: {
          accepted: messageContent.accepted,
          paymentLink: messageContent.paymentLink,
        },
        timestamp: serverTimestamp(),
        mediaUrl: "",
        type: "quoteResponse",
        isRead: false,
      });

      console.log("Message sent successfully");

      const lastMessage = messageContent.accepted
        ? `${currentUser.name} has accepted the quote`
        : `${currentUser.name} has rejected the quote`;
      const conversationRef = doc(db, "conversations", chatId);
      await setDoc(
        conversationRef,
        {
          lastMessage,
          updatedAt: serverTimestamp() as any,
          users: [currentUser, otherUser],
        },
        { merge: true }
      );

      console.log("recent message updated successfully");
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }

  async function respondQuote(
    accepted: boolean,
    messageId: string,
    basicQuoteDetails: {
      description: string;
      delivery: string;
      budget: number;
    },
    service: { serviceId: string; serviceName: string }
  ) {
    /*
     - on accept quote, create a new message with type "quote" sayiing "You have accepted the quote, Here is the payment Link"
      - generate payment link, and include it in the message
      - update the conversation with the new message
    */

    try {
      //! this code block checks if the quote has already been settled or not
      const quoteRef = doc(db, "conversations", chatId, "messages", messageId);
      const quoteSnapshot = await getDoc(quoteRef);

      // if the quote has already been settled, throw an error
      if (quoteSnapshot.exists()) {
        const quoteData = quoteSnapshot.data() as Extract<
          MessageType,
          { type: "quote" }
        >;
        if (quoteData.content.settled) {
          throw new Error("Quote has already been settled");
        } else {
          // set the status of code from "pending" to "accepted" or "rejected"
          await setDoc(
            quoteRef,
            {
              content: {
                ...quoteData.content,
                settled: true,
                status: accepted ? "accepted" : "rejected",
              } satisfies QuoteDetails,
            },
            { merge: true }
          );
        }
      }
      // generate payment link
      if (!accepted) {
        await sendQuoteMessage({
          accepted: false,
          paymentLink: null,
          quoteId: messageId,
        });
        return;
      }
      // payment link should encode data -> chatId, messageId so we can fetch the quote details in the payment page
      const paymentLink = await generatePaymentLinkForQuote({
        type: "quote",
        data: basicQuoteDetails,
        serviceId: service.serviceId,
        serviceName: service.serviceName,
      });
      // if
      await sendQuoteMessage({
        accepted: true,
        paymentLink,
        quoteId: messageId,
      });

      // show a toaster maybe or what
      return null;
    } catch (err: any) {
      alert(err.message);
      throw new Error(err.message); // handled in the onError callback
      // return;
    }
  }

  useEffect(() => {
    const dummy = document.querySelector(".dummy");
    if (dummy) {
      dummy.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isLoading)
    return (
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center">
        <Loader2 className="h-20 w-20 animate-spin" />
      </div>
    );
  if (error) return <div>Error loading messages: {error.message}</div>;

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto pt-4 px-4 pb-2">
        <div className="grid gap-4">
          {messages?.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const messageSenderDetails =
              message.senderId === currentUser.id
                ? currentUser
                : (otherUser as unknown as Session["user"]);
            return (
              <Message
                key={message.id}
                message={message}
                isCurrentUser={isCurrentUser}
                messageSenderDetails={messageSenderDetails}
                respondQuote={respondQuote}
                currentUserStatus={currentUser.status}
              />
            );
          })}
        </div>
        <div className="dummy"></div>
      </div>
      {/* Send Button */}
      <form
        className="border-t flex gap-2 items-center h-14 px-4"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!messageRef?.current?.value || !currentUserId) return;
          const message = messageRef.current?.value;
          messageRef.current.value = "";
          await sendMessage(message);
        }}
      >
        {/* <Button type="button" variant="ghost" size="icon">
            <PaperclipIcon className="w-4 h-4" />
            <span className="sr-only">Image</span>
          </Button> */}
        {/* <Input
            ref={messageRef}
            placeholder="Type your message"
            className="flex-1 min-w-0"
          /> */}
        <Textarea
          ref={messageRef}
          placeholder="Type your message (Shift+Enter for new line)"
          className="flex-1 min-h-10"
          rows={1}
          onKeyDown={(e) => {
            // e.key === "Enter" && e.shiftKey && e.preventDefault();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent a new line from being added
              e.currentTarget.form?.requestSubmit(); // Submit the form programmatically
            }
          }}
        />
        <Button type="submit" size="icon" className="w-8 h-8">
          <SendIcon className="w-4 h-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
