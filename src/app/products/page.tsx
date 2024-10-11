import { Metadata } from "next";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import AllProductsList from "~/components/AllProductsList";
import { ProductCard } from "~/components/ui/ProductCard";
import { api } from "~/trpc/react";

export const metadata: Metadata = {
  title: "All products",
};

export default function AllProducts() {
  // data will be split in pages
  return (
    <>
      <AllProductsList />
    </>
  );
}
