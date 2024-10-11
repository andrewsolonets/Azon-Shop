"use client";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { ProductPricingModel } from "~/server/db/schema";
interface DiscountDisplayProps {
  pricing: ProductPricingModel;
  size?: "small" | "large";
}

export default function PriceDisplay({
  pricing,
  size = "large",
}: DiscountDisplayProps) {
  const { originalPrice: oldPrice, price } = pricing;
  const originalPrice = Number(oldPrice);
  const discountedPrice = Number(price);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const discountApplied = originalPrice !== discountedPrice;

  useEffect(() => {
    if (discountApplied) {
      const calculateDiscount = () => {
        const discount =
          ((originalPrice - discountedPrice) / originalPrice) * 100;
        return Math.round(discount);
      };
      setDiscountPercentage(calculateDiscount());
    }
  }, [originalPrice, discountedPrice]);
  const mainPriceSize = size === "small" ? "text-2xl" : "text-3xl"; // Control size
  const originalPriceSize = size === "small" ? "text-base" : "text-lg"; // Control size
  if (!discountApplied) {
    return (
      <span className={cn("font-bold text-primary", mainPriceSize)}>
        ${discountedPrice.toFixed(2)}
      </span>
    );
  }

  return (
    <div className={"flex flex-col items-start space-y-2 font-sans"}>
      <div className="flex items-center space-x-2">
        <span className={cn("font-bold text-primary", mainPriceSize)}>
          ${discountedPrice.toFixed(2)}
        </span>
        <span
          className={cn(
            "text-lg text-muted-foreground line-through",
            originalPriceSize,
          )}
        >
          ${originalPrice.toFixed(2)}
        </span>
      </div>
      {size !== "small" ? (
        <div className="inline-block rounded bg-primary px-2 py-1 text-sm font-semibold text-primary-foreground">
          {discountPercentage}% OFF
        </div>
      ) : null}
    </div>
  );
}
