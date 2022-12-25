import { ButtonRegular } from "./Buttons";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";

export const ProductReviews = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [isFormOpen, setFormOpen] = useState(false);
  const { data: reviews } = trpc.product.getRating.useQuery(id);
  return (
    <div className=" flex h-fit flex-col gap-6 ">
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
            author={review.user ? review.user.name : review.userName}
            date={review.createdAt}
            text={review.message}
            rating={review.rating}
          />
        ))}
      </div>
    </div>
  );
};
