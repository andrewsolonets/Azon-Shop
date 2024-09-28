import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/node-postgres";

import { categories, products } from "./schema";
import * as schema from "./schema";
import { faker } from "@faker-js/faker";
import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import * as dotenv from "dotenv";
// import { env } from "~/env";
import pg from "pg";
import { eq } from "drizzle-orm";
const { Pool } = pg;
dotenv.config({ path: "./.env" });
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const main = async () => {
  const db = drizzle(pool);
  const fakeProducts = randProduct({
    length: 1000,
  });
  for (let index = 0; index < fakeProducts.length; index++) {
    const product = fakeProducts[index];
    const name = faker.commerce.productName();
    const productCategory = product?.category || "category"; // Example category

    // 1. Check if the category exists or create a new one
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, productCategory))
      .limit(1);

    let categoryId;

    if (existingCategory.length > 0) {
      // Category exists, use its ID
      categoryId = existingCategory[0].id;
    } else {
      // Category doesn't exist, insert a new one
      const insertedCategory = await db
        .insert(categories)
        .values({
          name: productCategory,
          createdAt: randBetweenDate({
            from: new Date("10/06/2020"),
            to: new Date(),
          }),
        })
        .returning({ id: categories.id });

      categoryId = insertedCategory[0].id;
    }

    // 2. Check if the product exists by title, then upsert
    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.title, name))
      .limit(1);

    if (existingProduct.length > 0) {
      // Product exists, update it
      await db
        .update(products)
        .set({
          description: product?.description || "hello world",
          price: faker.commerce.price(),
          // image: faker.image.abstract(640, 480, true),
          quantity: randNumber({ min: 10, max: 100 }),
          categoryId: categoryId, // Associate with the category
          createdAt: randBetweenDate({
            from: new Date("10/07/2020"),
            to: new Date(),
          }),
        })
        .where(eq(products.id, existingProduct[0].id));
    } else {
      // Product doesn't exist, insert it
      await db.insert(products).values({
        title: name,
        description: product?.description || "hello world",
        price: faker.commerce.price(),
        // image: faker.image.abstract(640, 480, true),
        quantity: randNumber({ min: 10, max: 100 }),
        categoryId: categoryId, // Associate with the category
        createdAt: randBetweenDate({
          from: new Date("10/07/2020"),
          to: new Date(),
        }),
      });
    }
  }
};

main();
