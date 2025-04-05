"use server";

import { getAuth } from "@/lib/auth";
import { db } from "@/lib/firebase/init";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

export async function SubmitReview({
  rating,
  review,
  serviceId,
  serviceName,
}: {
  rating: number;
  review: string;
  serviceId: string;
  serviceName: string;
}) {
  /**
   * 1- Check if the user is logged in
   * 2- Check if the user has payed for the service
   * 3- Check if the user has already submitted a review
   * 4- If the user is logged in, submit the review with the rating and review + the user details + the service details
   */

  try {
    const session = await getAuth();
    if (!session) {
      return {
        error: "You need to be logged in to submit a review",
      };
    }
    if (session.user.status === "seller") {
      return {
        error: "Sellers cannot submit reviews",
      };
    }

    const { user } = session;
    const paymentsRef = collection(db, "payments");
    const paymentQuery = query(
      paymentsRef,
      where("buyerId", "==", user.id),
      where("serviceId", "==", serviceId)
    );
    const paymentSnapshot = await getDocs(paymentQuery);

    if (paymentSnapshot.empty) {
      return {
        error: "You need to purchase the service to be able to submit a review",
      };
    }

    const reviewRef = collection(db, "reviews");
    // check if the user has already submitted a review
    const reviewQuery = query(
      reviewRef,
      where("serviceId", "==", serviceId),
      where("reviewerId", "==", user.id)
    );
    const reviewSnapshot = await getDocs(reviewQuery);
    if (!reviewSnapshot.empty) {
      return {
        error: "You have already submitted a review for this service",
      };
    }

    const { id, ...restUserProps } = user;
    await setDoc(doc(reviewRef), {
      rating,
      review,
      serviceId,
      serviceName,
      reviewer: restUserProps,
      reviewerId: user.id,
      timestamp: serverTimestamp(),
    });

    return {
      data: "Review submitted successfully",
    };
  } catch (err) {
    return {
      error: `An error occurred while submitting the review ${(err as Error).message}`,
    };
  }
}
