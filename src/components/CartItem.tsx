import Image from "next/image";
import PlusIcon from "../../public/static/img/PlusIcon";
import MinusIcon from "../../public/static/img/MinusIcon";
import CrossIcon from "../../public/static/img/CrossIcon";
import { useCartActions } from "../hooks/useCartActions";
import { type CartItemPlus } from "../utils/helpers";
import { type CartItemGuest } from "../types/cart";

type Props = {
  item: CartItemPlus | CartItemGuest;
};

export const CartItemCard = ({ item }: Props) => {
  const { quantity } = item;
  const { title, price, image } = item.product;
  const { removeItem, addToCartHandler, deleteOne } = useCartActions();
  const finalPrice = Math.round(Number(price));
  return (
    <div className="flex  h-32 min-h-[8rem] w-full items-center justify-between border-[3px] border-amber-400 bg-transparent px-2 md:justify-around md:px-0">
      <div className="flex h-full items-center gap-2 md:gap-6">
        <div className=" flex flex-col items-start justify-center gap-4">
          <button
            className="h-7 w-7"
            aria-label="Increase quantity"
            onClick={() => addToCartHandler(item.product, 1)}
          >
            <PlusIcon className="fill-amber-400 transition-all duration-300 hover:fill-violet-400" />
          </button>
          <button className="h-7 w-7" onClick={() => deleteOne(item)}>
            <MinusIcon
              aria-label="Decrease quantity"
              className="fill-amber-400 transition-all duration-300 hover:fill-violet-400"
            />
          </button>
        </div>
        <div className="relative h-24 w-24 object-cover object-center md:h-full md:w-28">
          <Image
            // changed image to static for data saving
            // src={image}
            src={"/static/img/testcardimg.png"}
            alt={title}
            className="object-cover"
            fill
            sizes="(min-width: 60em) 24vw,
                    (min-width: 28em) 45vw,
                    100vw"
          />
        </div>
      </div>
      <div className="flex w-1/3 flex-col items-center gap-2">
        <h6 className="text-center text-lg font-medium">{title}</h6>
        <div className="flex items-center gap-1 text-sm">
          Quantity:
          <span className="text-lg font-medium text-amber-400">{quantity}</span>
        </div>
      </div>
      <p>${finalPrice}</p>
      <button
        className="flex h-8 w-8 items-center justify-center rounded-sm bg-amber-400 transition-all duration-300 hover:bg-violet-600"
        onClick={() => removeItem(item.id)}
      >
        <CrossIcon className="fill-violet-600 transition-all duration-300 hover:fill-amber-400" />
      </button>
    </div>
  );
};
