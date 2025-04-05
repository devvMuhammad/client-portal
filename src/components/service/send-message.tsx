"use client";

import { startConversation } from "@/actions/start-conversation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef, useTransition } from "react";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

export default function StartConversation({
  sellerId,
  serviceId,
  serviceName,
}: {
  sellerId: string;
  serviceId: string;
  serviceName: string;
}) {
  const router = useRouter();
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [isPending, startTransition] = useTransition();

  async function sendMessageHandler() {
    if (!messageRef.current || !messageRef.current.value) return;

    const res = await startConversation(
      sellerId,
      messageRef.current.value,
      serviceId,
      serviceName
    );
    if (res?.error) {
      alert(res.error);
      return;
    }

    alert("message sent successfully");

    // router.push(`/chats/${res.id}`);
    // messageRef.current.value = "";
    // console.log("message sent successfully");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="inline">
          Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start Conversation</DialogTitle>
          <DialogDescription>Discuss your project details</DialogDescription>
        </DialogHeader>
        <Textarea
          ref={messageRef}
          placeholder="Type your message here."
          rows={4}
        />
        <DialogFooter className="sm:justify-end">
          {/* <DialogClose asChild> */}
          <Button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await sendMessageHandler();
              })
            }
          >
            Send Message
          </Button>
          {/* </DialogClose> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
