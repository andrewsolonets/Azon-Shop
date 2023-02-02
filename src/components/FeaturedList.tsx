import { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import ArrowCarouselIcon from "../assets/ArrowCarouselIcon";
import { type ExtProduct } from "../types/product";

interface Ref extends HTMLDivElement {
  offsetWidth: number;
  scrollLeft: number;
  scrollWidth: number;
}

export const FeaturedList = ({
  items,
}: {
  items: ExtProduct[] | undefined;
}) => {
  const carousel = useRef<Ref>(null);
  const maxScrollWidth = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
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
    <div className=" flex flex-col gap-6  ">
      <h4 className="ml-4 w-fit rounded-md bg-violet-600 px-4  py-1 font-semibold drop-shadow-sm">
        Featured Products
      </h4>
      <div className="relative ">
        <div className="absolute hidden h-full w-full items-center justify-between md:flex">
          <button
            onClick={movePrev}
            aria-label="Previous Page"
            className="group relative z-10 h-12 w-12 rotate-180 rounded-full bg-amber-400 p-2 transition-all duration-300 hover:bg-violet-800 disabled:opacity-0"
            disabled={isDisabled("prev")}
          >
            <ArrowCarouselIcon className=" fill-violet-600 transition-all duration-300 hover:fill-amber-400 group-hover:fill-amber-400" />
          </button>
          <button
            onClick={moveNext}
            aria-label="Next Page"
            className="group relative z-10 h-12 w-12 rounded-full bg-amber-400 p-2 transition-all duration-300 hover:bg-violet-800 disabled:opacity-0"
            disabled={isDisabled("next")}
          >
            <ArrowCarouselIcon className=" fill-violet-600 transition-all duration-300 hover:fill-amber-400 group-hover:fill-amber-400" />
          </button>
        </div>
        <div
          className=" relative  flex touch-pan-x snap-x snap-mandatory justify-between gap-6 overflow-x-auto scroll-smooth md:overflow-x-hidden  "
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
