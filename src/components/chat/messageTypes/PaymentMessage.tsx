import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatCurrency, formatMessageTimestamp } from "@/lib/utils";
import { AdditionalPaymentDataType, MessageType } from "@/types";
import { CheckIcon } from "lucide-react";

interface PaymentMessageProps {
  message: Extract<MessageType, { type: "payment" }>;
  sender: string;
}

export const PaymentMessage: React.FC<PaymentMessageProps> = ({
  message,
  sender,
}) => {
  return (
    <>
      <span className="flex items-center gap-2 text-sm">
        <div>
          <span className="font-medium  text-base">{sender}</span> made a
          payment of <strong>${message.content.amount / 100}</strong>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {message.timestamp?.seconds
            ? formatMessageTimestamp(message.timestamp.seconds)
            : "Delivering ..."}
        </span>
      </span>
      <Dialog>
        <DialogTrigger asChild>
          <span className="text-alphaDark text-sm hover:underline cursor-pointer">
            | Here are the Transaction Details
          </span>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {/* <pre>{JSON.stringify(message.content, null, 2)}</pre> */}
          {message.content.type === "quote" && (
            <PayedQuoteDetails
              transactionId={message.content.transactionId}
              data={message.content.data}
            />
          )}
          {message.content.type === "upfront" && (
            <UpfrontPaymentDetails
              transactionId={message.content.transactionId}
              data={message.content.data}
            />
          )}
        </DialogContent>
      </Dialog>
      <span className="text-alphaDark text-sm">
        You can start working on the project now!
      </span>
    </>
  );
};

function PayedQuoteDetails({
  transactionId,
  data,
}: {
  transactionId: string;
  data: Extract<AdditionalPaymentDataType, { type: "quote" }>["data"];
}) {
  const {
    quoteDetails: { budget, description, delivery },
    serviceName,
  } = data;

  return (
    <div className="grid gap-4 py-4">
      <div>
        <h1 className="text-xl font-bold">Payment Details</h1>
        <p>
          Transaction ID: <strong>{transactionId}</strong>
        </p>
        <p className="text-sm text-muted-foreground">
          This is the quote you payed for:
        </p>
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-medium">Budget</p>
        <p className="text-2xl font-bold">{formatCurrency(budget)}</p>
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-medium">Description</p>
        <Textarea rows={5} value={description} />
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-medium">Delivery Time</p>
        <div className="rounded-md border px-4 py-2 text-sm">{delivery}</div>
      </div>
    </div>
  );
}

function UpfrontPaymentDetails({
  transactionId,
  data,
}: {
  transactionId: string;
  data: Extract<AdditionalPaymentDataType, { type: "upfront" }>["data"];
}) {
  const {
    package: { title, price, features },
    selectedUpsells,
    baseQuantity,
  } = data;

  const upsellsPrice = selectedUpsells.reduce(
    (acc, upsell) => acc + upsell.price,
    0
  );

  // const gst = Number(((price * baseQuantity + upsellsPrice) * 0.1).toFixed(2));
  const total = Number((price * baseQuantity + upsellsPrice + 0).toFixed(2));

  return (
    <div className="text-card-foreground space-y-4">
      <div>
        <h1 className="text-xl font-bold">Payment Details</h1>
        <p className="text-muted-foreground">
          These are the packages and upsells (if any) you payed for:
        </p>
        <p>
          Transaction ID: <strong>{transactionId}</strong>
        </p>
      </div>
      <Separator />
      <div className="w-full flex justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-lg font-semibold">
          {baseQuantity} x {formatCurrency(price)} ={" "}
          {formatCurrency(price * baseQuantity)}
        </p>
      </div>
      {/* @Package Features */}
      <div className="space-y-2">
        {features.map((feature, index) => (
          <PackageFeature key={index}>{feature}</PackageFeature>
        ))}
      </div>
      <Separator />
      {/* @Extras */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Extras</h3>
        {selectedUpsells.length > 0 ? (
          <div className="space-y-2">
            {selectedUpsells.map((upsell, index) => (
              <PackageExtra key={index} price={upsell.price}>
                {upsell.name}
              </PackageExtra>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No extras added</p>
        )}
      </div>

      <Separator />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Summary</h3>

        <PaymentMetric metric="Service" amount={price * baseQuantity} />
        <PaymentMetric metric="Extras" amount={upsellsPrice} />
        {/* <PaymentMetric metric="GST" amount={gst} /> */}
      </div>
      <Separator className="my-4" />
      <PaymentMetric
        metric="Total"
        className="font-bold text-xl text-black"
        amount={total}
      />
    </div>
  );
}

function PackageFeature({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <CheckIcon className="h-5 w-5 text-alphaDark" strokeWidth={3} />
      <span>{children}</span>
    </div>
  );
}

function PackageExtra({
  children,
  price,
}: {
  children: React.ReactNode;
  price: number;
}): React.ReactElement {
  return (
    <div className="w-full flex justify-between">
      <p className="flex items-center gap-2  text-muted-foreground">
        <CheckIcon className="h-5 w-5 text-alphaDark" strokeWidth={3} />
        {children}
      </p>
      <p>+ {formatCurrency(price)}</p>
    </div>
  );
}

function PaymentMetric({
  metric,
  amount,
  className,
}: {
  metric: string;
  amount: number;
  className?: string;
}) {
  return (
    <div className={cn(" w-full flex justify-between", className)}>
      <h3 className="text-muted-foreground">{metric}</h3>
      <p>{formatCurrency(amount)}</p>
    </div>
  );
}
