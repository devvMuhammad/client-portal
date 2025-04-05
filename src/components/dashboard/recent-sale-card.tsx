import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

export default function RecentSaleCard({
  name,
  email,
  image,
  amount,
}: {
  name: string;
  image: string;
  email: string;
  amount: number;
}) {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage src={image} alt="Avatar" />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
      <div className="ml-auto font-medium">+{formatCurrency(amount)}</div>
    </div>
  );
}
