import Image from "next/image";
import { ButtonRegular } from "./Buttons";
import { useCartActions } from "../hooks/useCartActions";
import Link from "next/link";
import { Rating } from "@smastrom/react-rating";
import { RatingStyles } from "./RatingStyles";
import { type ExtProduct } from "../types/product";
import { getAvgRating } from "../utils/helpers";

type Props = {
  product: ExtProduct;
};

export const ProductCard = ({ product }: Props) => {
  const { title, price, image, id, quantity } = product;
  const { addToCartHandler } = useCartActions();
  const priceFinal = Math.round(Number(price));
  const avgRating = getAvgRating(product.Ratings);
  return (
    <div className="mb-2 flex w-full min-w-[15rem] snap-center flex-col justify-between rounded-lg bg-violet-600 drop-shadow-md md:w-60">
      <Link href={`/products/${id}`}>
        <div className="relative h-40 w-full  object-cover ">
          <Image src={image} alt={title} fill className="rounded-lg" />
        </div>
      </Link>
      <div className="flex w-full flex-col items-center justify-end gap-4 px-3 py-4 ">
        <Link
          href={`/products/${id}`}
          className="flex w-full flex-col items-center justify-end gap-2"
        >
          <h4 className=" text-center text-xl font-medium hover:text-amber-400 ">
            {title}
          </h4>

          <h4 className="text-xl font-bold">${priceFinal}</h4>
          <h5
            className={`text-lg font-bold ${
              quantity > 0 ? "" : "text-violet-400"
            }`}
          >{`${quantity > 0 ? "In stock" : "Out of stock"}`}</h5>
        </Link>

        <div className="w-28">
          <Rating
            value={avgRating ? avgRating : 4}
            itemStyles={RatingStyles}
            readOnly
          />
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
