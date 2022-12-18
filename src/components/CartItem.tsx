import Image from "next/image";
import TestCardImg from "../assets/testcardimg.png";
import PlusIcon from "../assets/PlusIcon";
import MinusIcon from "../assets/MinusIcon";
import CrossIcon from "../assets/CrossIcon";
import { useCartActions } from "../hooks/useCartActions";
import { type Product, type CartItem } from "@prisma/client";

interface CartItemExt extends CartItem {
  product: Product;
}

type Props = {
  item: CartItemExt;
};

export const CartItemCard = ({ item }: Props) => {
  const { quantity } = item;
  const { title, price, image } = item.product;
  const { removeItem, addToCartHandler, deleteOne } = useCartActions();
  const finalPrice = Math.round(Number(price));
  return (
    <div className="flex h-28 w-full items-center justify-around border-[3px] border-amber-400 bg-transparent">
      <div className="flex h-full gap-6">
        <div className=" flex flex-col justify-center gap-4">
          <button
            className="h-7 w-7"
            onClick={() => addToCartHandler(item.product, 1)}
          >
            <PlusIcon />
          </button>
          <button className="h-7 w-7" onClick={() => deleteOne(item)}>
            <MinusIcon />
          </button>
        </div>
        <div className="relative h-full w-28 object-cover object-center">
          <Image src={TestCardImg} alt={title} fill />
        </div>
      </div>
      <div className="flex w-1/4 flex-col items-center gap-2">
        <h6 className="text-center text-lg font-medium">{title}</h6>
        <div className="flex items-center gap-1 text-sm">
          Quantity:
          <span className="text-lg font-medium text-amber-400">{quantity}</span>
        </div>
      </div>
      <p>${finalPrice}</p>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-400"
        onClick={() => removeItem(item.id)}
      >
        <CrossIcon />
      </button>
    </div>
  );
};
