"use client";

import Image from "next/image";
// import { useCartActions } from "../hooks/useCartActions";
import Link from "next/link";
import { Rating } from "@smastrom/react-rating";
// import { RatingStyles } from "./RatingStyles";
// import { type ExtProduct } from "../types/product";
// import { getAvgRating } from "../utils/helpers";
import StarIcon from "public/img/StartIcon";
import { ButtonRegular } from "./Buttons";
import { ProductWithRelations, ReviewModel } from "~/server/db/schema";
import { useCartActions } from "~/hooks/useCartActions";
import { getAvgRating } from "~/utils/helpers";

type Props = {
  product: ProductWithRelations;
};

export const RatingStyles = {
  itemShapes: <StarIcon />,
  activeFillColor: "#fbbf24",
  inactiveFillColor: "#8b5cf6",
};

export const ProductCard = ({ product }: Props) => {
  const { title, price, image, id, quantity: rawQuantity } = product;
  const quantity = rawQuantity ?? 0;
  const { addToCartHandler } = useCartActions();
  const priceFinal = Math.round(Number(price));
  const avgRating = getAvgRating(product?.reviews ?? []);
  return (
    <div className="mb-2 flex w-full min-w-[15rem] snap-center flex-col justify-between rounded-lg bg-violet-600 drop-shadow-md md:w-60">
      <Link href={`/products/${id}`}>
        <div className="relative h-40 w-full object-cover">
          <Image
            // changed image to static for data saving
            // src={image}

            src={"/img/product.webp"}
            alt={title ?? "invalid image"}
            fill
            className="rounded-lg object-cover"
            sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          />
        </div>
      </Link>
      <div className="flex w-full flex-col items-center justify-end gap-4 px-3 py-4">
        <Link
          href={`/products/${id}`}
          className="flex w-full flex-col items-center justify-end gap-2"
        >
          <h4 className="text-center text-xl font-medium hover:text-amber-400">
            {title}
          </h4>

          <h4 className="text-xl font-bold">${priceFinal}</h4>
          <h5
            className={`text-lg font-bold ${
              quantity > 0 ? "" : "text-violet-400"
            }`}
          >{`${quantity > 0 ? "In stock" : "Out of stock"}`}</h5>
        </Link>
        <div className="flex justify-center gap-2">
          <div className="w-28">
            <Rating
              value={avgRating ? avgRating : 4}
              itemStyles={RatingStyles}
              readOnly
            />
          </div>
          <span>({product?.reviews?.length})</span>
        </div>

        <div className="w-full">
          <ButtonRegular
            onClick={() => addToCartHandler(product, 1)}
            disabled={quantity < 1}
          >
            Add to Cart
          </ButtonRegular>
        </div>
      </div>
    </div>
  );
};
