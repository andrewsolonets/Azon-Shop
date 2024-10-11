import "server-only";
import { db } from "./db";
import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import {
  ProductPricingModel,
  productPricings,
  products,
  ProductWithRelations,
  reviews,
} from "./db/schema";
import { toast } from "react-toastify";

export type ReviewItem = {
  productId: number;
  rating: number;
  heading: string;
  message: string;
  username?: string | undefined;
};

export async function getFeaturedProducts() {
  const now = new Date();
  const featuredProducts = await db.query.products.findMany({
    limit: 20,
    with: {
      reviews: true,
      pricing: {
        where: and(
          or(
            isNull(productPricings.startDate),
            lte(productPricings.startDate, now),
          ),
          or(
            isNull(productPricings.endDate),
            gte(productPricings.endDate, now),
          ),
        ),
        orderBy: (productPricings, { desc }) => [
          desc(productPricings.startDate),
        ],
        limit: 1, // Select only one pricing
      },
    },
  });
  const formatted = featuredProducts?.map((product) => {
    return {
      ...product,
      pricing: product?.pricing?.[0] ?? null, // Extract the first element or use null
    };
  });
  // console.log(formatted);
  return formatted;
}

export async function getProduct(id: number) {
  const now = new Date();
  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      reviews: {
        orderBy: (reviews, { desc }) => [desc(reviews.createdAt)],
      },
      category: true,
      pricing: {
        where: and(
          or(
            isNull(productPricings.startDate),
            lte(productPricings.startDate, now),
          ),
          or(
            isNull(productPricings.endDate),
            gte(productPricings.endDate, now),
          ),
        ),
        orderBy: (productPricings, { desc }) => [
          desc(productPricings.startDate),
        ],
        limit: 1, // Select only one pricing
      },
    },
  });

  const formattedProduct = { ...product, pricing: product?.pricing[0] ?? null };

  // console.log(product);
  return formattedProduct as ProductWithRelations;
}

export async function getCategory(id: number) {
  const now = new Date();
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.id, Number(id)),
    with: {
      products: {
        with: {
          reviews: true,
          pricing: {
            where: and(
              or(
                isNull(productPricings.startDate),
                lte(productPricings.startDate, now),
              ),
              or(
                isNull(productPricings.endDate),
                gte(productPricings.endDate, now),
              ),
            ),
            orderBy: (productPricings, { desc }) => [
              desc(productPricings.startDate),
            ],
            limit: 1, // Select only one pricing
          },
        },
      },
    },
  });

  const formattedCategory = {
    ...category,
    products: category?.products?.map((product) => {
      return {
        ...product,
        pricing: product?.pricing?.[0] ?? null, // Extract the first element or use null
      };
    }),
  };
  return formattedCategory;
}
