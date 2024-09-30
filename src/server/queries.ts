import "server-only";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { products, reviews } from "./db/schema";
import { toast } from "react-toastify";

export type ReviewItem = {
  productId: number;
  rating: number;
  heading: string;
  message: string;
  username?: string | undefined;
};

export async function getFeaturedProducts() {
  const featuredProducts = await db.query.products.findMany({
    limit: 20,
    with: {
      reviews: true,
    },
  });

  return featuredProducts;
}

export async function getProduct(id: number) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      reviews: {
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      },
    },
  });

  return product;
}
