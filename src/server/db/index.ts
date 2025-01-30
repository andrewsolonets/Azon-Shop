import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { env } from "~/env";

const connectionString = env.POSTGRES_URL;
// Use this object to send drizzle queries to your DB
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
