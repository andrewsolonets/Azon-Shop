import { toast } from "react-toastify";
import { type ReviewItem } from "../types/product";
import { trpc } from "../utils/trpc";

export const useReviewActions = () => {
  const utils = trpc.useContext();
  const trpcAddReview = trpc.product.postRating.useMutation({
    async onMutate(item: ReviewItem) {
      await utils.product.getRating.cancel(item.productId);
      const prevData = utils.product.getRating.getData(item.productId);
      const date = new Date();
      const itemNew = { ...item, createdAt: date, id: Math.random() * 1000 };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.product.getRating.setData(item.productId, (old) => {
        if (!old) return itemNew;
        return [...old, itemNew];
      });
      return { prevData };
    },
    onError(err, newItem, ctx) {
      // If the mutation fails, use the context-value from onMutate
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      utils.product.getRating.setData(newItem.productId, ctx.prevData);
    },
    onSettled(e) {
      console.log(e);
      utils.product.getRating.invalidate(e?.productId);
    },
  });
  const addReview = ({
    productId,
    rating,
    heading,
    message,
    username,
  }: ReviewItem) => {
    trpcAddReview.mutate({ rating, productId, heading, message, username });
    toast.success("Review Added!");
  };
  return { addReview };
};
