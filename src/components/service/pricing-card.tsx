"use client";

import { Package, PackageType, Upsell } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import SendMessage from "@/components/service/send-message";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "../ui/button";
import RequestQuote from "./request-quote";
import { CheckIcon } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { buyNow } from "@/actions/buy-now";

interface PricingCardProps {
  serviceId: string;
  serviceName: string;
  currentPackageType: PackageType;
  currentPackage: Package;
  sellerDetails: { name: string; id: string; address: string };
  upsells: Upsell[];
}

export default function PricingCard({
  serviceId,
  serviceName,
  currentPackageType,
  currentPackage,
  sellerDetails,
  upsells,
}: PricingCardProps): React.ReactElement {
  // destructuring the variables
  const { name, id: sellerId, address } = sellerDetails;
  const {
    price: basePrice,
    description,
    features,
    introduction,
    title,
  } = currentPackage;

  // states
  const [quantity, setQuantity] = useState(1);
  const [buyRedirectPending, startBuyRedirectTransition] = useTransition();
  const [totalPrice, setTotalPrice] = useState(basePrice);
  const [selectedUpsells, setSelectedUpsells] = useState<Upsell[]>([]);
  const ref = useRef<HTMLDivElement>();

  function addUpsell(extraPrice: number, upsell: Upsell) {
    setTotalPrice(totalPrice + extraPrice);
    setSelectedUpsells([...selectedUpsells, upsell]);
  }

  function removeUpsell(extraPrice: number, upsell: Upsell) {
    setTotalPrice(totalPrice - extraPrice);
    setSelectedUpsells(
      selectedUpsells.filter(
        (selectedUpsell) => selectedUpsell.name !== upsell.name
      )
    );
  }

  useEffect(() => {
    // Recalculate total price based on base price, quantity, and selected upsells
    const upsellsTotal = selectedUpsells.reduce(
      (sum, upsell) => sum + upsell.price,
      0
    );
    setTotalPrice(basePrice * quantity + upsellsTotal);
  }, [basePrice, quantity, selectedUpsells]);

  console.log(selectedUpsells, "selectedUpsells inside the buy now sheet");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {features.map((feature, index) => (
          <PackageFeature key={index}>{feature}</PackageFeature>
        ))}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="text-4xl font-bold">${basePrice}</div>
        <div className="flex gap-2">
          {/* //! @BUY NOW (WITH UPSELLS) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button>Buy Now</Button>
            </SheetTrigger>
            <SheetContent className="grid grid-rows-[auto_1fr_auto] gap-2">
              <SheetHeader className="pb-1 mb-2">
                <SheetTitle>Order options</SheetTitle>
              </SheetHeader>
              {/* @Current Package Displayer */}
              <div className="overflow-y-auto pr-2">
                <div className="border-2 border-solid border-black p-4 rounded-md">
                  <div className="w-full flex justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-lg font-semibold">${basePrice}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {introduction}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <Label htmlFor="quantity" className="mr-2">
                      Quantity
                    </Label>
                    {/* @Increment and Decrement Buttons */}
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <p className="px-4 py-2 border rounded-lg mx-2">
                        {quantity}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
                {/* @Upsells */}
                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-semibold">
                    Upgrade your order with extras
                  </h3>
                  {/* @Upsell */}
                  {upsells.map((upsell, index) => (
                    <UpsellComponent
                      key={index}
                      upsell={upsell}
                      addUpsell={addUpsell}
                      removeUpsell={removeUpsell}
                    />
                  ))}
                </div>
              </div>

              {/* @Sheet Footer */}
              <SheetFooter className="mt-4">
                <div className="w-full flex gap-2 flex-col">
                  <Button
                    // href="/service/checkout"
                    disabled={buyRedirectPending}
                    onClick={() => {
                      startBuyRedirectTransition(async () => {
                        try {
                          await buyNow({
                            type: "upfront",
                            serviceId,
                            serviceName,
                            data: {
                              packageType: currentPackageType,
                              package: currentPackage,
                              selectedUpsells,
                              baseQuantity: quantity,
                            },
                          });
                        } catch (err: any) {
                          console.log(err);
                          alert(err.message);
                        }
                      });
                    }}
                    className="w-full"
                  >
                    Continue ($ {totalPrice.toLocaleString()})
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    You won&apos;t be charged yet. <br />
                    You need to login to continue
                  </p>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          {/* //! @REQUEST A QUOTE */}
          <RequestQuote
            serviceId={serviceId}
            sellerId={sellerId}
            serviceName={serviceName}
          />
          {/* <Button variant="outline" onClick={onQuestion}>
            Message
          </Button> */}
          <SendMessage
            sellerId={sellerId}
            serviceId={serviceId}
            serviceName={serviceName}
          />
        </div>
      </CardFooter>
    </Card>
  );
}

function PackageFeature({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex items-center gap-2">
      <CheckIcon className="h-5 w-5 text-primary" />
      <span>{children}</span>
    </div>
  );
}

function UpsellComponent({
  upsell,
  addUpsell,
  removeUpsell,
}: {
  upsell: Upsell;
  addUpsell: (price: number, upsell: Upsell) => void;
  removeUpsell: (price: number, upsell: Upsell) => void;
}) {
  const [check, setCheck] = useState(false);
  return (
    <div
      className={`space-y-1 border p-4 rounded-md ${check && "border-2 border-solid border-alpha"}`}
    >
      <div className="flex items-center justify-between ">
        <p className="font-semibold">{upsell.name}</p>
        <Checkbox
          id="extra-fast-delivery"
          checked={check}
          onCheckedChange={(val) => {
            // if false, then add
            setCheck(val as boolean);
            if (val) {
              addUpsell(upsell.price, upsell);
            } else {
              removeUpsell(upsell.price, upsell);
            }
          }}
        />
      </div>
      <p className="text-muted-foreground">
        {" "}
        + USD {upsell.price.toLocaleString()}
      </p>
    </div>
  );
}
