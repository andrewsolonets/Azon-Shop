"use client";
import MinusIcon from "public/img/MinusIcon";
import PlusIcon from "public/img/PlusIcon";
import { useState } from "react";
import { ProductWithRelations } from "~/server/db/schema";
import { BigButton } from "./ui/Buttons";
import { toast } from "react-toastify";
import { useCartActions } from "~/hooks/useCartActions";

export const QuantitywCart = ({
  product,
}: {
  product: ProductWithRelations;
}) => {
  const { addToCartHandler } = useCartActions();
  const [quantityCounter, setQuantity] = useState(1);

  const { image, title, price, quantity: rawQuantity } = product;
  const quantity = rawQuantity ?? 0;

  const finalPrice = Math.round(Number(price));

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row">
      <div className="flex flex-col items-center gap-1">
        <span>Price</span>
        <span className="text-2xl font-bold">${finalPrice}</span>
      </div>
      <div className="relative flex flex-col items-center gap-1">
        <span>Quantity</span>
        <div className="flex items-center gap-2">
          <button
            className="h-5 w-5"
            onClick={() => {
              if (quantityCounter > 0) {
                setQuantity((prev) => (prev -= 1));
              }
            }}
          >
            <MinusIcon className="fill-amber-400 hover:fill-violet-400" />
          </button>

          <input
            type="text"
            onChange={(e) => {
              const newValue = Number(e.target.value);
              if (!isNaN(newValue)) setQuantity(newValue);
            }}
            value={quantityCounter}
            className="relative w-10 rounded-md border-0 bg-violet-800 px-2 py-1 text-center text-xl font-bold"
          />
          <button
            className="h-5 w-5"
            onClick={() =>
              setQuantity((prev) => {
                if (prev < quantity) {
                  return (prev += 1);
                } else {
                  toast.info(`Maxed out (only ${quantity} items available)`);
                  return prev;
                }
              })
            }
          >
            <PlusIcon className="fill-amber-400 hover:fill-violet-400" />
          </button>
        </div>
      </div>
      <BigButton
        onClick={() => addToCartHandler(product, quantityCounter)}
        disabled={quantity < 1}
      >
        Add to Cart
      </BigButton>
    </div>
  );
};
