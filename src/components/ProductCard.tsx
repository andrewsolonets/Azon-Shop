import Image from "next/image";
import { ButtonRegular } from "./Buttons";
import TestCardImg from "../assets/testcardimg.png";
import { useCartActions } from "../hooks/useCartActions";
import { type Product } from "@prisma/client";
import Link from "next/link";

type Props = {
  product: Product;
};

export const ProductCard = ({ product }: Props) => {
  const { title, price, image, id } = product;
  const { addToCartHandler } = useCartActions();
  const priceFinal = Math.round(Number(price));
  return (
    <div className="mb-2 flex w-60 min-w-[15rem] snap-center flex-col justify-between rounded-lg bg-violet-600 drop-shadow-md">
      <Link href={`/products/${id}`}>
        <div className="relative h-40 w-full  object-cover ">
          <Image src={image} alt={title} fill className="rounded-lg" />
        </div>
      </Link>
      <div className="flex w-full flex-col items-center justify-end gap-4 px-3 py-4 ">
        <Link
          href={`/products/${id}`}
          className="flex w-full flex-col items-center justify-end gap-4"
        >
          <h4 className=" text-center text-xl font-bold hover:text-amber-400 ">
            {title}
          </h4>

          <h4 className="text-xl font-normal">${priceFinal}</h4>
        </Link>
        <div className="w-full">
          <ButtonRegular onClick={() => addToCartHandler(product, 1)}>
            Add to Cart
          </ButtonRegular>
        </div>
      </div>
    </div>
  );
};
