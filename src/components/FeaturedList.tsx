import { type Product } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import Arrow from "../assets/arrowcarousel.svg";

interface Ref extends HTMLDivElement {
  offsetWidth: number;
  scrollLeft: number;
  scrollWidth: number;
}

export const FeaturedList = ({ items }: { items: Product[] | undefined }) => {
  const carousel = useRef<Ref>(null);
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log(carousel.current?.scrollWidth);
    console.log(carousel.current?.offsetWidth);
    maxScrollWidth.current = carousel.current
      ? carousel.current.scrollWidth - carousel.current.offsetWidth
      : 0;
  }, [items]);

  const movePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    }
  };

  const moveNext = () => {
    if (
      carousel.current !== null &&
      carousel.current.offsetWidth * currentIndex <= maxScrollWidth.current
    ) {
      setCurrentIndex((prevState) => prevState + 1);
    }
  };

  const isDisabled = (direction: string) => {
    if (direction === "prev") {
      return currentIndex <= 0;
    }

    if (
      direction === "next" &&
      carousel.current !== null &&
      currentIndex !== 0
    ) {
      console.log(carousel.current.offsetWidth * currentIndex);
      console.log(maxScrollWidth.current);
      return (
        carousel.current.offsetWidth * currentIndex + 400 >=
        maxScrollWidth.current
      );
    }

    return false;
  };

  useEffect(() => {
    if (carousel !== null && carousel.current !== null) {
      carousel.current.scrollLeft = carousel.current.offsetWidth * currentIndex;
    }
  }, [currentIndex]);

  return (
    <div className=" flex  flex-col gap-6 px-4">
      <h4 className="ml-4 w-fit rounded-md bg-violet-600 px-4 py-1 font-semibold drop-shadow-sm">
        Featured Products
      </h4>
      <div className="relative ">
        <div className="top left absolute  flex h-full w-full items-center justify-between ">
          <button
            onClick={movePrev}
            className="relative z-20 h-12 w-12 rotate-180 rounded-full bg-amber-400 p-2 disabled:opacity-0"
            disabled={isDisabled("prev")}
          >
            <Arrow />
          </button>
          <button
            onClick={moveNext}
            className="relative z-20 h-12 w-12 rounded-full bg-amber-400 p-2 disabled:opacity-0"
            disabled={isDisabled("next")}
          >
            <Arrow />
          </button>
        </div>
        <div
          className=" relative flex touch-pan-x snap-x  snap-mandatory gap-8 overflow-x-auto scroll-smooth md:overflow-x-hidden  "
          ref={carousel}
        >
          {items?.map((el) => {
            return <ProductCard product={el} key={el.id} />;
          })}
        </div>
      </div>
    </div>
  );
};
