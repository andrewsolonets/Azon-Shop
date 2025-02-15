"use client";

import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

import { ProductWithRelations } from "~/server/db/schema";
import { ProductCard } from "~/components/ui/ProductCard";
import ArrowCarouselIcon from "public/img/ArrowCarouselIcon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

interface Ref extends HTMLDivElement {
  offsetWidth: number;
  scrollLeft: number;
  scrollWidth: number;
}

export const FeaturedList = ({
  items,
}: {
  items: ProductWithRelations[] | undefined;
}) => {
  return (
    <div className="flex flex-col gap-6">
      <h4 className="ml-4 w-fit rounded-md bg-violet-600 px-4 py-1 font-semibold drop-shadow-sm">
        Featured Products
      </h4>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        <CarouselContent className="h-full">
          {items?.map((el) => (
            <CarouselItem
              key={el.id}
              className="relative flex-shrink-0 sm:basis-auto sm:pl-6"
            >
              <ProductCard product={el} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-1 hidden sm:inline-flex" />

        <CarouselNext className="absolute right-1 hidden sm:inline-flex" />
      </Carousel>
    </div>
  );
};
