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

/*
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
import { redis } from "./redis/redis";

// Helper function for cache operations
async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 3600,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const freshData = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(freshData));
  return freshData;
}

// Cache keys
const cacheKeys = {
  featuredProducts: "featured-products",
  product: (id: number) => `product:${id}`,
  category: (id: number) => `category:${id}`,
};

export async function getFeaturedProducts() {
  return withCache(cacheKeys.featuredProducts, async () => {
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
          limit: 1,
        },
      },
    });

    return featuredProducts.map((product) => ({
      ...product,
      pricing: product?.pricing?.[0] ?? null,
    }));
  });
}

export async function getProduct(id: number) {
  return withCache(cacheKeys.product(id), async () => {
    const now = new Date();
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        reviews: { orderBy: (reviews, { desc }) => [desc(reviews.createdAt)] },
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
          limit: 1,
        },
      },
    });

    return {
      ...product,
      pricing: product?.pricing[0] ?? null,
    } as ProductWithRelations;
  });
}

export async function getCategory(id: number) {
  return withCache(cacheKeys.category(id), async () => {
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
              limit: 1,
            },
          },
        },
      },
    });

    return {
      ...category,
      products: category?.products?.map((product) => ({
        ...product,
        pricing: product?.pricing?.[0] ?? null,
      })),
    };
  });
}


*/
