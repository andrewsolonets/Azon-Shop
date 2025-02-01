// Updated pricingSeed.ts
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import * as dotenv from "dotenv";
import pg from "pg";
import { faker } from "@faker-js/faker";

dotenv.config({ path: "./.env" });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });

const MIN_PRICE = 30;

const main = async () => {
  const db = drizzle(pool);
  try {
    const products = await db.select().from(schema.products);

    const pricingsToInsert = products.map((el, i) => {
      const discounted = i % 2 === 0; // More explicit condition
      const endDate = new Date("2040-09-23T18:47:13.030Z");
      const basePrice = parseFloat(
        faker.commerce.price({
          min: MIN_PRICE,
          max: MIN_PRICE + 300, // Add buffer to ensure max > min
          dec: 2,
        }),
      ); // Ensure numeric conversion

      // Safe price generation with valid min/max ranges
      const generateOriginalPrice = () => {
        const minPrice = basePrice + 1;
        return faker.commerce.price({
          min: minPrice,
          max: minPrice + 100, // Add buffer to ensure max > min
          dec: 2,
        });
      };

      return {
        productId: el.id,
        startDate: el.createdAt,
        endDate: discounted ? endDate : null, // Use null instead of undefined
        price: basePrice.toString(),
        originalPrice: discounted
          ? generateOriginalPrice()
          : basePrice.toString(),
      };
    });

    // Batch insert in chunks
    const BATCH_SIZE = 100;
    for (let i = 0; i < pricingsToInsert.length; i += BATCH_SIZE) {
      const batch = pricingsToInsert.slice(i, i + BATCH_SIZE);
      await db.insert(schema.productPricings).values(batch);
    }

    console.log("Successfully seeded pricing data!");
  } catch (error) {
    console.error("Error seeding pricing data:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

main().catch(console.error);
