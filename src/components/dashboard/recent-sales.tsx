import getPayments from "@/actions/get-payments";
import RecentSaleCard from "./recent-sale-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export async function RecentSales() {
  const payments = await getPayments();

  return (
    <Card className="col-span-4 md:col-span-3">
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>
          Overall, {payments.length} payments have been made
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {payments.map((payment) => (
            <RecentSaleCard
              key={payment.transactionId}
              name={payment.buyerDetails.name || "User"}
              email={payment.buyerDetails.email || "email@undefined.com"}
              image={payment.buyerDetails.image || ""}
              amount={payment.amount}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
