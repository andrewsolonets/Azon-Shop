"use client";
import { ButtonRegular } from "./Buttons";

import { useState } from "react";

import { useRouter } from "next/router";
import { ReviewForm } from "./ReviewForm";
import { ReviewCard } from "./ReviewCard";
import { ReviewModel } from "~/server/db/schema";

export const ProductReviews = ({ reviews }: { reviews: ReviewModel[] }) => {
  const [isFormOpen, setFormOpen] = useState(false);

  return (
    <div className="flex h-fit flex-col gap-6">
      {!isFormOpen ? (
        <ButtonRegular onClick={() => setFormOpen((prev) => !prev)}>
          Leave a Review
        </ButtonRegular>
      ) : null}
      {isFormOpen ? <ReviewForm setIsOpen={setFormOpen} /> : null}
      <h4 className="w-fit rounded-md bg-violet-600 px-4 py-1 font-semibold drop-shadow-sm md:ml-4">
        Reviews
      </h4>

      <div className="grid auto-cols-max grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {reviews?.map((review) => (
          <ReviewCard
            key={review.id}
            title={review.heading}
            author={review.authorName}
            // author={review.user ? review.user.name : review.authorName}
            date={review.createdAt}
            text={review.message}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};
