// "use client";
// import { ImageIcon, SendIcon } from "lucide-react";
// import { Button } from "../ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Input } from "../ui/input";
// import { useEffect, useRef, useState, useTransition } from "react";
// import { MessageType } from "@/types/index";
// // import { nanoid } from "nanoid";

// import { db } from "@/lib/firebase/init";
// import {
//   addDoc,
//   collection,
//   doc,
//   onSnapshot,
//   orderBy,
//   query,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { useSession } from "next-auth/react";
// import { UserType } from "./Chats";
// import { Session } from "next-auth";
// import Message from "./Message";
// // import { sendChatMessage } from "@/actions/send-chat-message";

// export default function Messages({
//   // initialMessages,
//   chatId,
//   otherUser,
//   currentUser,
// }: {
//   // initialMessages: any;
//   chatId: string;
//   otherUser: UserType;
//   currentUser: Session["user"];
// }) {
//   const { data: session } = useSession();
//   // console.log("other user in client", otherUser);

//   const currentUserId = session?.user?.id;
//   // const currentUser = session?.user as unknown as Session["user"];

//   const messageRef = useRef<HTMLInputElement>(null);
//   // const [isPending, startTransition] = useTransition();
//   // console.log(first);
//   // console.log("initialMessages", initialMessages);
//   const [messages, setMessages] = useState<MessageType[]>([]);

//   async function sendMessageHandler() {
//     if (!messageRef?.current?.value) return;
//     const message = messageRef.current?.value;
//     messageRef.current.value = "";
//     const messagesRef = collection(db, "conversations", chatId, "messages");
//     if (!currentUserId) return;

//     // const newMessageId = nanoid();
//     try {
//       await addDoc(
//         messagesRef,
//         {
//           // id: newMessageId,
//           senderId: currentUserId,
//           content: message,
//           timestamp: serverTimestamp(),
//           mediaUrl: "",
//           type: "text",
//           isRead: false,
//         }
//         // satisfies Omit<MessageType, "id">
//       );

//       console.log("Message sent successfully");

//       // Optionally, update the conversation's lastMessage and updatedAt fields
//       const conversationRef = doc(db, "conversations", chatId);
//       await setDoc(
//         conversationRef,
//         {
//           lastMessage: message,
//           updatedAt: serverTimestamp() as any,
//           users: [currentUser, otherUser],
//         },
//         { merge: true }
//       );

//       console.log("recent message updated successfully");
//     } catch (error) {
//       console.error("Error sending message: ", error);
//     }
//   }

//   useEffect(() => {
//     const messagesRef = collection(db, "conversations", chatId, "messages");
//     const q = query(messagesRef, orderBy("timestamp", "asc"));

//     const unsubscribe = onSnapshot(q, (querySnapshot) => {
//       // console.log(querySnapshot.docs);
//       const messages: MessageType[] = [];
//       // querySnapshot.docChanges().forEach((change) => {})
//       querySnapshot.forEach((doc) => {
//         messages.push(doc.data() as MessageType);
//       });
//       setMessages(messages);
//     });

//     return () => {
//       unsubscribe();
//     };
//   }, [chatId]);

//   // scroll to dummy in view when messages change
//   useEffect(() => {
//     const dummy = document.querySelector(".dummy");
//     if (dummy) {
//       dummy.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   return messages.length > 0 ? (
//     <div className="flex-1 min-h-0 flex flex-col">
//       {/* @Chat Header */}
//       <div className="hidden md:flex items-center border-b h-14 px-4">
//         <Avatar className="w-10 h-10">
//           {otherUser.image ? (
//             <AvatarImage alt="Picture" src={otherUser.image} />
//           ) : (
//             <AvatarFallback>
//               <AvatarImage src="/placeholder-user.jpg" />
//               <AvatarFallback>{otherUser.name}</AvatarFallback>
//             </AvatarFallback>
//           )}
//         </Avatar>
//         <div className="ml-4 flex flex-col">
//           <span className="font-semibold">{otherUser.name}</span>
//           <span className="text-muted-foreground text-xs font-thin">
//             {otherUser.email}
//           </span>
//         </div>
//       </div>
//       {/* @Chat Messages */}
//       <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
//         <div className="flex-1 overflow-y-auto pt-4 px-4 pb-2">
//           <div className="grid gap-4">
//             {messages.map((message) => {
//               const isCurrentUser = message.senderId === currentUser.id;
//               const messageSenderDetails =
//                 message.senderId === currentUser.id
//                   ? currentUser
//                   : (otherUser as unknown as Session["user"]);
//               // console.log("here inside the client", messageSenderDetails);
//               return (
//                 <Message
//                   message={message}
//                   isCurrentUser={isCurrentUser}
//                   messageSenderDetails={messageSenderDetails}
//                 />
//               );
//             })}
//           </div>
//           <div className="dummy"></div>
//         </div>
//         {/* @Send Button */}
//         <form
//           className="border-t flex gap-2 items-center h-14 px-4"
//           onSubmit={async (e) => {
//             // if (!messageRef.current?.value) return;
//             // messageRef.current.value = "";
//             e.preventDefault();
//             // startTransition(async () => {
//             await sendMessageHandler();
//             // });
//           }}
//         >
//           <Button type="button" variant="ghost" size="icon">
//             <ImageIcon className="w-4 h-4" />
//             <span className="sr-only">Image</span>
//           </Button>
//           <Input
//             ref={messageRef}
//             placeholder="Type your message"
//             className="flex-1 min-w-0"
//           />
//           <Button
//             type="submit"
//             size="icon"
//             className="w-8 h-8"
//             // disabled={isPending}
//           >
//             <SendIcon className="w-4 h-4" />
//             <span className="sr-only">Send</span>
//           </Button>
//         </form>
//       </div>
//     </div>
//   ) : (
//     <div>Loading ...</div>
//   );
// }

// Messages.tsx
