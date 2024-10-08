import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import { faker } from "@faker-js/faker";

import * as dotenv from "dotenv";
// import { env } from "~/env";
import pg from "pg";

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const { Pool } = pg;
dotenv.config({ path: "./.env" });
const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const main = async () => {
  const db = drizzle(pool);
  const products = await db.select().from(schema.products);

  // Use a for...of loop to await each async operation
  for (const product of products) {
    const quantity = 3;
    const { id } = product;

    for (let i = 0; i < quantity; i++) {
      const name = faker.person.fullName();
      const heading = `${faker.commerce.productAdjective()} ${faker.lorem.sentence(2)}`;
      const message = faker.lorem.sentences(2);
      const rating = randomIntFromInterval(3, 5);

      // Ensure 'createdAt' uses proper date objects
      const createdAt = faker.date.between({
        from: new Date("2020-01-01T00:00:00.000Z"), // From date
        to: new Date("2022-12-01T00:00:00.000Z"), // To date
      });
      await db.insert(schema.reviews).values({
        productId: id,
        authorName: name,
        heading,
        message,
        rating,
        createdAt,
      });
    }
  }
};

// Call the main function and catch any errors
main().catch(console.error);
