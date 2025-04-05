import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatTimestamp } from "@/lib/utils";
import { Review } from "@/types";
import { StarIcon, UserIcon } from "lucide-react";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      key={review.id}
      className="bg-white border-solid border-2 border-border p-4 rounded-xl flex gap-4"
    >
      <Avatar className="w-12 h-12 border">
        <AvatarImage src={review.reviewer.image as string} alt="User Avatar" />
        <AvatarFallback>
          <UserIcon className="w-6 h-6" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 grid gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{review.reviewer.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatTimestamp(review.timestamp.seconds)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-5 h-5 ${
                  star <= review.rating
                    ? "fill-primary  stroke-primary"
                    : "fill-muted stroke-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-muted-foreground">{review.review}</p>
      </div>
    </div>
  );
}
