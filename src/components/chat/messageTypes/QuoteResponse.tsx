import { formatMessageTimestamp } from "@/lib/utils";
import { MessageType } from "@/types";
import Link from "next/link";

interface QuoteResponseMessageProps {
  message: Extract<MessageType, { type: "quoteResponse" }>;
  sender: string;
  isSeller: boolean;
}

export const QuoteResponseMessage: React.FC<QuoteResponseMessageProps> = ({
  sender,
  message,
  isSeller,
}) => (
  <>
    <div className="flex items-center gap-2 text-sm">
      {/* Quote response */}
      <div>
        <span className="font-medium text-base">{sender}</span>{" "}
        {message.content.accepted ? "accepted the quote" : "rejected the quote"}
      </div>
      {/* Timestamp */}
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {message.timestamp?.seconds
          ? formatMessageTimestamp(message.timestamp.seconds)
          : "Delivering ..."}
      </span>
    </div>
    <div className="flex items-center gap-4 text-sm leading-snug text-gray-500 dark:text-gray-400">
      {isSeller ? (
        message.content.accepted ? (
          <p className="text-muted-foreground text-sm cursor-pointer">
            Waiting for Payment ...
          </p>
        ) : (
          <p className="text-destructive text-sm">
            The quote has been rejected
          </p>
        )
      ) : message.content.accepted ? (
        <Link
          href={message.content.paymentLink}
          className="text-alphaDark text-sm hover:underline cursor-pointer"
        >
          | Here is the payment Link
        </Link>
      ) : (
        <p className="text-destructive text-sm">The quote has been rejected</p>
      )}
    </div>
  </>
);
