"use client";
import MinusIcon from "public/img/MinusIcon";
import PlusIcon from "public/img/PlusIcon";
import { useEffect, useState } from "react";
import { ProductWithRelations } from "~/server/db/schema";
import { BigButton } from "./ui/Buttons";
import { toast } from "react-toastify";
import { useCartActions } from "~/hooks/useCartActions";
import PriceDisplay from "./PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";

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
        <QuantitySelector
          quantity={quantityCounter}
          available={quantity}
          changeQuantity={setQuantity}
        />
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
