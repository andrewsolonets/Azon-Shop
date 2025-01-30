import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "./schema";
import * as dotenv from "dotenv";
// import { env } from "~/env";
import pg from "pg";
import { algoliasearch } from "algoliasearch";

const { Pool } = pg;
dotenv.config({ path: "./.env" });

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "",
  process.env.ADMIN_ALGOLIA_KEY ?? "",
);

const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
const main = async () => {
  const db = drizzle(pool);
  try {
    const products = await db.select().from(schema.products);
    /*
       ALGOLIA UPDATE DATA BASED ON CURRENT PRODUCTS (CAN BE USED SEPARATELY)
       You can both add new items with this as well as update existing ones. If objectID matches the existing one, it will be updated.
       See https://www.algolia.com/doc/api-client/methods/indexing/ for how to manipulate data (delete, update, replace etc.)
      */

    // CHANGE TO YOUR INDEX NAME
    // const index = client.initIndex("azon1");
    const objectsToAdd = products?.map((el) => ({
      ...el,
      objectID: el?.id,
      name: el?.title,
    }));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore

    await client
      .saveObjects({ indexName: "azon1", objects: objectsToAdd })
      .then((res) => {
        console.log(res.map((el) => el.objectIDs));
      });
  } catch (error) {
    throw error;
  }
};

// Call the main function and catch any errors
main().catch(console.error);
