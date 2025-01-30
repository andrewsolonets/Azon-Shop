import { drizzle } from "drizzle-orm/node-postgres";
import { categories, products } from "./schema";
import { faker } from "@faker-js/faker";
import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import * as dotenv from "dotenv";
import pg from "pg";
import { eq } from "drizzle-orm";

dotenv.config({ path: "./.env" });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const db = drizzle(pool);

const main = async () => {
  const fakeProducts = randProduct({ length: 1000 });

  for (const product of fakeProducts) {
    const name = faker.commerce.productName();
    const productCategory = product?.category || "category"; // Example category

    // 1. Check if the category exists or create a new one
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.name, productCategory))
      .limit(1);

    let categoryId: number;

    if (existingCategory.length > 0 && existingCategory?.[0]) {
      // Category exists, use its ID
      categoryId = existingCategory?.[0]?.id;
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
      if (insertedCategory?.[0]) {
        categoryId = insertedCategory[0].id;
      }
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
          //@ts-expect-error price
          price: Number(faker.commerce.price()), // Ensure price is a number
          // image: faker.image.abstract(640, 480, true), // Uncomment if needed
          quantity: randNumber({ min: 10, max: 100 }),
          //@ts-expect-error categoryId
          categoryId, // Associate with the category
          createdAt: randBetweenDate({
            from: new Date("10/07/2020"),
            to: new Date(),
          }),
        })
        //@ts-expect-error null
        .where(eq(products.id, existingProduct?.[0]?.id));
    } else {
      // TODO: Add product pricing to each newly created product

      // Product doesn't exist, insert it
      //@ts-expect-error insert
      await db.insert(products).values({
        title: name,
        description: product?.description || "hello world",
        price: Number(faker.commerce.price()), // Ensure price is a number
        // image: faker.image.abstract(640, 480, true), // Uncomment if needed
        quantity: randNumber({ min: 10, max: 100 }),
        //@ts-expect-error categoryId
        categoryId, // Associate with the category
        createdAt: randBetweenDate({
          from: new Date("10/07/2020"),
          to: new Date(),
        }),
      });
    }
  }
};

main().catch((err) => {
  console.error("Error in the process:", err);
});
