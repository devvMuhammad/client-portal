import { Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { TimestampType } from "@/types";
import { formatMessageTimestamp } from "@/lib/utils";
import { CheckCheckIcon, CheckIcon } from "lucide-react";

interface MessageAvatarProps {
  messageSenderDetails: Session["user"];
}

export const MessageAvatar: React.FC<MessageAvatarProps> = ({
  messageSenderDetails,
}) => (
  <Avatar className="w-10 h-10">
    {messageSenderDetails.image ? (
      <AvatarImage
        alt="Picture"
        src={messageSenderDetails.image}
        referrerPolicy="no-referrer"
      />
    ) : (
      <AvatarFallback>
        <AvatarImage src="/placeholder-user.jpg" />
        <AvatarFallback>{messageSenderDetails.name}</AvatarFallback>
      </AvatarFallback>
    )}
  </Avatar>
);

interface MessageHeaderProps {
  messageSenderDetails: Session["user"];
  isCurrentUser: boolean;
  timestamp: TimestampType;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({
  messageSenderDetails,
  isCurrentUser,
  timestamp,
}) => (
  <div className="flex items-center gap-4">
    <p className="font-medium">
      {isCurrentUser ? "You" : messageSenderDetails.name}
    </p>
    <div className="flex gap-1">
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {timestamp?.seconds && formatMessageTimestamp(timestamp.seconds)}
      </span>
      {timestamp ? (
        <CheckCheckIcon className="h-4 w-4 text-muted-foreground" />
      ) : (
        <CheckIcon className="h-4 w-4 text-muted-foreground" />
      )}
    </div>
  </div>
);
