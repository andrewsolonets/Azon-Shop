"use client";
import MinusIcon from "public/img/MinusIcon";
import PlusIcon from "public/img/PlusIcon";
import { useEffect, useState } from "react";
import { ProductWithRelations } from "~/server/db/schema";
import { BigButton } from "./ui/Buttons";
import { toast } from "react-toastify";
import { useCartActions } from "~/hooks/useCartActions";
import PriceDisplay from "./PriceDisplay";

export const QuantitywCart = ({
  product,
}: {
  product: ProductWithRelations;
}) => {
  const { addToCartHandler } = useCartActions();
  const [quantityCounter, setQuantity] = useState(1);

  const { quantity: rawQuantity, pricing } = product;
  const quantity = rawQuantity ?? 0;

  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div className="flex flex-col items-start">
        <span>Price</span>
        {/* <span className="text-2xl font-bold">${finalPrice}</span> */}
        {pricing ? <PriceDisplay pricing={pricing} /> : null}
      </div>
      <div className="relative flex flex-col items-center gap-1">
        <span>Quantity</span>
        <div className="flex items-center gap-2">
          <button
            disabled={quantityCounter === 1}
            className="group h-5 w-5"
            onClick={() => {
              if (quantityCounter > 0) {
                setQuantity((prev) => (prev -= 1));
              }
            }}
          >
            <MinusIcon className="fill-amber-400 hover:fill-violet-400 group-disabled:pointer-events-none group-disabled:fill-violet-300" />
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
            disabled={quantityCounter === quantity}
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
