import React from "react";
import { BasicQuoteDetailsType, MessageType } from "@/types";
import { Session } from "next-auth";

import { MessageAvatar, MessageHeader } from "./MessageHeader";
import { PaymentMessage } from "./messageTypes/PaymentMessage";
import { QuoteMessage } from "./messageTypes/QuoteDetails";
import { QuoteResponseMessage } from "./messageTypes/QuoteResponse";
import { TextMessage } from "./messageTypes/TextMessage";
import { CheckCheck, CheckIcon } from "lucide-react";

interface MessageProps {
  message: MessageType;
  messageSenderDetails: Session["user"];
  isCurrentUser: boolean;
  respondQuote: (
    accepted: boolean,
    messageId: string,
    basicQuoteDetails: BasicQuoteDetailsType,
    service: { serviceId: string; serviceName: string }
  ) => Promise<any>;
  currentUserStatus: Session["user"]["status"];
}

export const Message: React.FC<MessageProps> = ({
  message,
  messageSenderDetails,
  isCurrentUser,
  currentUserStatus,
  respondQuote,
}) => {
  const renderMessageContent = () => {
    switch (message.type) {
      case "payment":
        return (
          <PaymentMessage
            sender={messageSenderDetails.name || "Buyer"}
            message={message}
          />
        );
      case "quote":
        return (
          <QuoteMessage
            sender={messageSenderDetails.name || "Buyer"}
            message={message}
            respondQuote={respondQuote}
            isSeller={currentUserStatus === "seller"}
          />
        );
      case "quoteResponse":
        return (
          <QuoteResponseMessage
            sender={messageSenderDetails.name || "Buyer"}
            message={message}
            isSeller={currentUserStatus === "seller"}
          />
        );
      default:
        return (
          <TextMessage
            message={message.content}
            // timestamp={message.timestamp}
          />
        );
    }
  };

  return (
    <div
      key={message.id}
      className={`rounded-lg py-1 pl-2 ${
        message?.timestamp?.seconds ? "" : "bg-zinc-200"
      }`}
    >
      <div className="flex items-center gap-4">
        <MessageAvatar messageSenderDetails={messageSenderDetails} />
        <div className="grid gap-1">
          {message.type === "text" && (
            <MessageHeader
              messageSenderDetails={messageSenderDetails}
              isCurrentUser={isCurrentUser}
              timestamp={message.timestamp}
            />
          )}
          {renderMessageContent()}
          {/* {renderCheckIcon()} */}
        </div>
      </div>
    </div>
  );
};

export default Message;
