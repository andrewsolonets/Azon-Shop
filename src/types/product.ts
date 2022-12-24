import type { Product, Ratings } from "@prisma/client";

export interface ExtProduct extends Product {
  Ratings: Ratings[];
}

export type ReviewItem = {
  productId: string;
  rating: number;
  heading: string;
  message: string;
  username?: string | undefined;
};
