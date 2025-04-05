"use client";

import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ReactNode, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SubmitReview } from "@/actions/submit-review";
import { getReviews } from "@/actions/get-reviews";
import ReviewCard from "./review-card";
import { Skeleton } from "../ui/skeleton";

export default function Reviews({
  // reviews,
  serviceId,
  serviceName,
}: {
  // reviews: Review[];
  serviceId: string;
  serviceName: string;
}) {
  const { data: reviews, isPending } = useQuery({
    queryKey: ["reviews", serviceId],
    queryFn: () => getReviews(serviceId),
  });

  // return <pre>{JSON.stringify(reviews, null, 2)}</pre>;
  let listToRender: ReactNode;
  if (isPending) {
    listToRender = <ReviewLoadingSkeleton />;
  } else {
    if (reviews?.length) {
      listToRender = reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ));
    } else {
      listToRender = (
        <p className="text-lg text-muted-foreground">
          No reviews yet. Be the first to write one!
        </p>
      );
    }
  }

  return (
    <section className="max-w-4xl px-4 md:px-0">
      <div className="grid gap-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Hear from real people who have used our services.
            </p>
          </div>
          <WriteReview serviceId={serviceId} serviceName={serviceName} />
        </div>
        <div className="grid gap-4">{listToRender}</div>
      </div>
    </section>
  );
}

function WriteReview({
  serviceId,
  serviceName,
}: {
  serviceId: string;
  serviceName: string;
}) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const { mutate, isPending } = useMutation({
    mutationFn: SubmitReview,
    onSuccess: (data) => {
      const { error } = data;
      if (error) {
        alert(error);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["reviews", serviceId] });
      alert(data.data); // it is the success message from the server basically
    },
  });

  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ rating, review, serviceId, serviceName });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Write a Review</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Give a rating out of 5 and describe your experience
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="flex items-center gap-4">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-6 h-6 cursor-pointer border-primary ${
                    star <= rating
                      ? "fill-primary  stroke-primary"
                      : "fill-muted stroke-muted-foreground"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Describe your detailed experience with the service (More than 50
              words)
            </Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              id="description"
              placeholder="Type your message here."
              className="min-h-[100px]"
              maxLength={1000}
              rows={5}
            />
            <span className="text-muted-foreground text-sm">
              {review.length}/1000
            </span>
          </div>
          <DialogFooter className="justify-end">
            <Button
              loading={isPending}
              // disabled={review.length < 50 ||i !!!rating} //! dont forget to set this later
              disabled={review.length === 0 || !!!rating}
              type="submit"
            >
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ReviewLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 bg-gray-300" />
      <Skeleton className="h-28 bg-gray-300" />
      <Skeleton className="h-28 bg-gray-300" />
    </div>
  );
}
