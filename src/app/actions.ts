"use server";

import { toast } from "react-toastify";
import { db } from "~/server/db";
import { reviews } from "~/server/db/schema";
import { ReviewItem } from "~/server/queries";

export async function addReview({
  productId,
  rating,
  heading,
  message,
  username,
}: ReviewItem) {
  await db
    .insert(reviews)
    .values({ rating, productId, heading, message, authorName: username });

  toast.success("Review Added!");
}
