import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "../icons";
import getPayments from "@/actions/get-payments";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/lib/firebase/init";
import { PaymentDataType } from "@/types";
import { formatCurrency } from "@/lib/utils";
import ActiveUsers from "./active-users";

export default async function OverviewStatistics() {
  const [payments, reviews] = await Promise.all([
    getPayments(),
    getDocs(query(collection(db, "payments"))),
  ]);
  const totalRevenue = payments.reduce(
    (acc: number, payment: PaymentDataType) => acc + payment.amount,
    0
  );
  const reviewsData = reviews.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as any;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <Icons.revenue />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalRevenue)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Purchases</CardTitle>
          <Icons.purchases />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{payments.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reviews</CardTitle>
          <Icons.user />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reviewsData.length}</div>
        </CardContent>
      </Card>
      <ActiveUsers />
    </div>
  );
}
