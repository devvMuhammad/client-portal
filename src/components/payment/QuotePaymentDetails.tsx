import { formatCurrency } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export default function QuotePaymentDetailds({
  serviceName,
  basePrice,
  quoteDescription,
  delivery,
}: {
  serviceName: string;
  basePrice: number;
  quoteDescription: string;
  delivery: string;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <div className="space-y-2">
        {/* @Gig Tile */}
        <p className="text-muted-foreground">Gig Title</p>
        <h1 className="text-xl font-semibold ">{serviceName}</h1>
      </div>
      <Separator />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <p className="font-medium">Budget</p>
          <p className="text-2xl font-bold">{formatCurrency(basePrice)}</p>
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium">Description</p>
          <Textarea rows={5} value={quoteDescription} readOnly />
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium">Delivery Time</p>
          <div className="rounded-md border px-4 py-2 text-sm">{delivery}</div>
        </div>
      </div>
      {/* @Payment summary */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Seller Details</h3>
        <div className="space-y-2 text-muted-foreground">
          <p>Jez Kez</p>
          <p>Melbourne, Australia</p>
          <p>SEOIT Agency</p>
        </div>
      </div>
    </div>
  );
}
