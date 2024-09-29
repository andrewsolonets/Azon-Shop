import "server-only";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { products } from "./db/schema";

export async function getFeaturedProducts() {
  const featuredProducts = await db.query.products.findMany({
    limit: 20,
    with: {
      ratings: true,
    },
  });

  return featuredProducts;
}

export async function getProduct(id: number) {
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      ratings: true,
    },
  });

  return product;
}
