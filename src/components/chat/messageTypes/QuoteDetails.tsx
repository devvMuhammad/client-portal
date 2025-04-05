import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, formatMessageTimestamp } from "@/lib/utils";
import { BasicQuoteDetailsType, MessageType, QuoteDetails } from "@/types";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

interface QuoteMessageProps {
  sender: string;
  message: Extract<MessageType, { type: "quote" }>;
  respondQuote: (
    accepted: boolean,
    messageId: string,
    basicQuoteDetails: BasicQuoteDetailsType,
    service: { serviceId: string; serviceName: string }
  ) => Promise<any>;
  isSeller: boolean;
}

export const QuoteMessage: React.FC<QuoteMessageProps> = ({
  sender,
  message,
  respondQuote,
  isSeller,
}) => (
  <>
    <div className="flex items-center gap-2 text-sm">
      <span className="font-medium text-base">{sender}</span> made a quote for{" "}
      <strong>${message.content.budget}</strong>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {message.timestamp?.seconds
          ? formatMessageTimestamp(message.timestamp.seconds)
          : "Delivering ..."}
      </span>
    </div>
    <div className="text-sm leading-snug text-gray-500 dark:text-gray-400">
      <ViewQuoteDetails
        messageId={message.id}
        respondQuote={respondQuote}
        quoteDetails={message.content}
        isSeller={isSeller}
      />
    </div>
  </>
);

interface ViewQuoteDetailsProps {
  quoteDetails: QuoteDetails;
  messageId: string;
  respondQuote: (
    accepted: boolean,
    messageId: string,
    basicQuoteDetails: BasicQuoteDetailsType,
    service: { serviceId: string; serviceName: string }
  ) => Promise<any>;
  isSeller: boolean;
}

export const ViewQuoteDetails: React.FC<ViewQuoteDetailsProps> = ({
  quoteDetails,
  respondQuote,
  messageId,
  isSeller,
}) => {
  const { isPending, mutate } = useMutation({
    mutationFn: async ({
      accepted,
      messageId,
    }: {
      accepted: boolean;
      messageId: string;
    }) => {
      return await respondQuote(
        accepted,
        messageId,
        {
          description: quoteDetails.description,
          delivery: quoteDetails.delivery,
          budget: quoteDetails.budget,
        },
        {
          // get the serviceId and serviceName from the quoteDetails (message content of "quote")
          serviceId: quoteDetails.serviceId,
          serviceName: quoteDetails.serviceName,
        }
      );
    },
    onSuccess: () => {
      alert("Quote Response Sent");
    },
    onError: (err) => {
      console.log(err);
      // alert(err);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-alphaDark text-sm hover:underline cursor-pointer">
          | View Details Here
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Quote Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium">{quoteDetails.serviceName}</p>
            <p className="text-sm font-medium">Budget</p>
            <p className="text-2xl font-bold">
              {formatCurrency(quoteDetails.budget)}
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Description</p>
            <Textarea rows={5} value={quoteDetails.description} />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Delivery Time</p>
            <div className="rounded-md border px-4 py-2 text-sm">
              {quoteDetails.delivery}
            </div>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Files</p>
            <div className="space-y-1">
              {quoteDetails.files && quoteDetails.files.length > 0 ? (
                quoteDetails.files.map((file, index) => (
                  <a
                    key={file.url + index}
                    // href={file.url}
                    href="https://firebasestorage.googleapis.com/v0/b/seoit-ec267.appspot.com/o/quotes%2FuZ25Q0N6J8ddhRzod6LZ%2Fsaas.jpeg?alt=media"
                    className="block text-blue-500 hover:underline mr-2"
                    // download={file.metadata.name}
                    download
                    target="_blank"
                    // rel="noopener noreferrer"
                  >
                    {file.metadata.name} -{" "}
                    {Math.round(file.metadata.size / 1000)} KB
                  </a>
                ))
              ) : (
                <span className="text-muted-foreground">No files uploaded</span>
              )}
            </div>
          </div>
        </div>
        {isSeller && quoteDetails.status === "pending" && (
          <DialogFooter className="flex gap-2">
            <Button
              disabled={isPending}
              onClick={() => mutate({ accepted: false, messageId })}
              variant="destructive"
            >
              Reject
            </Button>
            <Button
              disabled={isPending}
              onClick={() => mutate({ accepted: true, messageId })}
            >
              Accept
            </Button>
          </DialogFooter>
        )}
        {quoteDetails.status !== "pending" && (
          <p className="text-right">This quote has already been settled!</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
