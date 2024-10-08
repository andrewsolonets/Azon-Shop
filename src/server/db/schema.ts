// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { InferSelectModel, Many, relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `azon-shop_${name}`);

// Shop

// model Product {
//   id          String     @id @default(cuid())
//   title       String     @unique
//   description String
//   price       String
//   quantity    Int
//   image       String
//   createdAt   DateTime   @default(now())
//   category    Category?  @relation(fields: [categoryId], references: [id])
//   categoryId  String?
//   CartItem    CartItem[]
//   Ratings     Ratings[]

//   @@index([categoryId])
// }
export const products = createTable(
  "product",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }),
    description: varchar("description", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    price: varchar("price", { length: 256 }),
    quantity: integer("quantity"),
    image: varchar("image", { length: 256 }),
    categoryId: integer("category_id"),
  },
  (product) => ({
    nameIndex: index("categoryId_idx").on(product.categoryId),
  }),
);

export type ProductSelectModel = InferSelectModel<typeof products>;
export type ReviewModel = InferSelectModel<typeof reviews>;
export type CategoryModel = InferSelectModel<typeof categories>;
export type CartModel = InferSelectModel<typeof carts>;
export type OrderModel = InferSelectModel<typeof orders>;
export type ProductWithRelations = ProductSelectModel & {
  reviews?: Array<ReviewModel>; // Optional array of reviews
  category?: CategoryModel | null; // Optional category or null
};

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
}));

// model Category {
//   id        String    @id @default(cuid())
//   name      String    @unique
//   createdAt DateTime  @default(now())
//   products  Product[]
// }
export const categories = createTable("category", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

// model CartItem {
//   id        String  @id @default(cuid())
//   product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
//   productId String
//   quantity  Int

//   cart   Cart   @relation(fields: [cartId], references: [id], onUpdate: Cascade, onDelete: Cascade)
//   cartId String

//   @@index([productId])
//   @@index([cartId])
// }

export const cartItems = createTable("cart_item", {
  id: serial("id").primaryKey(),
  quantity: integer("quantity"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  userId: varchar("user_id", { length: 256 }),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  cartId: integer("cart_id")
    .references(() => carts.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}));

// model Cart {
//   id        String     @id @default(cuid())
//   createdAt DateTime   @default(now())
//   user      User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
//   userId    String?    @unique
//   items     CartItem[]

//   @@index([userId])
// }

export const carts = createTable("cart", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  userId: varchar("user_id", { length: 256 }),
});

export const cartsRelations = relations(carts, ({ many }) => ({
  cartItems: many(cartItems),
}));

// model Ratings {
//   id        String   @id @default(cuid())
//   rating    Int
//   createdAt DateTime @default(now())
//   product   Product  @relation(fields: [productId], references: [id])
//   productId String
//   heading   String
//   message   String
//   userName  String?
//   user      User?    @relation(fields: [userId], references: [id])
//   userId    String?

//   @@index([productId])
//   @@index([userId])
// }
export const reviews = createTable("reviews", {
  id: serial("id").primaryKey(),
  rating: integer("rating"),
  heading: varchar("heading", { length: 256 }),
  message: varchar("message", { length: 256 }),
  authorName: varchar("author_name", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  productId: integer("product_id").notNull(),
  authorId: varchar("author_id", { length: 256 }),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

// model Order {
//   id           String   @id @default(cuid())
//   createdAt    DateTime @default(now())
//   user         User?    @relation(fields: [userId], references: [id])
//   userId       String?
//   status       String
//   totalAmount  Int
//   customerNote String

//   @@index([userId])
// }
export const orders = createTable("order", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 256 }),
  totalAmount: integer("total_amount"),
  customerNote: varchar("customer_note", { length: 256 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  userId: varchar("user_id", { length: 256 }).notNull(),
});

// Necessary for Next auth
// model Account {
//   id                String  @id @default(cuid())
//   userId            String
//   type              String
//   provider          String
//   providerAccountId String
//   refresh_token     String? @db.Text
//   access_token      String? @db.Text
//   expires_at        Int?
//   token_type        String?
//   scope             String?
//   id_token          String? @db.Text
//   session_state     String?
//   user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

//   @@unique([provider, providerAccountId])
//   @@index([userId])
// }

// model Session {
//   id           String   @id @default(cuid())
//   sessionToken String   @unique
//   userId       String
//   expires      DateTime
//   user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

//   @@index([userId])
// }

// enum Role {
//   USER
//   ADMIN
// }

// model User {
//   id            String    @id @default(cuid())
//   name          String?
//   email         String?   @unique
//   emailVerified DateTime?
//   image         String?
//   orders        Order[]
//   accounts      Account[]
//   sessions      Session[]
//   Cart          Cart?
//   role          Role      @default(USER)
//   ratingsGiven  Ratings[]
// }
