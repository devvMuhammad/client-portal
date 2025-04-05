import { formatCurrency } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { CheckIcon } from "lucide-react";

export default function UpfrontPaymentDetails({
  serviceName,
  title,
  baseQuantity,
  basePrice,
  servicePrice,
  features,
  selectedUpsells,
}: {
  serviceName: string;
  title: string;
  baseQuantity: number;
  servicePrice: number;
  basePrice: number;
  features: string[];
  selectedUpsells: { name: string; price: number }[];
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <div className="space-y-2">
        {/* @Gig Tile */}
        <p className="text-muted-foreground">Gig Title</p>
        <h1 className="text-xl font-semibold ">{serviceName}</h1>
      </div>
      <Separator />
      {/* @Package Type */}
      <div className="w-full flex justify-between">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-lg font-semibold">
          {baseQuantity} x {formatCurrency(servicePrice)} ={" "}
          {formatCurrency(basePrice)}
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
      {/* @Payment summary */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Seller Details</h3>
        <div className="space-y-2 text-muted-foreground">
          {/* @Figure this out later in  */}
          <p>Jez Kez</p>
          <p>Melbourne, Australia</p>
          <p>SEOIT Agency</p>
        </div>
      </div>
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
