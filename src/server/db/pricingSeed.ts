import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import * as dotenv from "dotenv";
// import { env } from "~/env";
import pg from "pg";
import { faker } from "@faker-js/faker";

dotenv.config({ path: "./.env" });
// import { env } from "~/env";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const main = async () => {
  const db = drizzle(pool);
  try {
    const products = await db.select().from(schema.products);
    const pricingsToInsert = products?.map((el, i) => {
      const discounted = i % 2;
      const endDate = new Date("2040-09-23T18:47:13.030Z");

      return {
        productId: el.id,
        startDate: el.createdAt,
        endDate: discounted ? endDate : undefined,
        price: el.price,
        originalPrice: discounted
          ? faker.commerce.price({ min: Number(el.price) + 1 })
          : el.price,
      };
    });
    await db.insert(schema.productPricings).values(pricingsToInsert);
  } catch (error) {
    throw error;
  }
};

// Call the main function and catch any errors
main().catch(console.error);
