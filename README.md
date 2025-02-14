# Azon Shop

E-commerce website built with the modern t3-stack (typescript, drizzle, trpc, next.js app router)
(see v1 for older t3-stack implementation w/ prisma)

## Features

- Fully functioning, persistent Cart
- Infinite scroll
- Rating System
- User profile with order history
- Checkout with Stripe
- Custom db with orders connected to Stripe
- Authentication w/ Clerk
- Algolia Autocomplete search
- Product discounts and price history

## Migration from pages to app router

The current version was migrated to use app router along drizzle ORM and clerk auth. v1 branch is saved as a reference, built with pages router, prisma and next auth.

## Environment Variables

To run this project, you will need to add the environment variables from .env.example to your .env file

## Run Locally

Clone the project

```bash
  git clone https://github.com/andrewsolonets/Azon-Shop.git
```

Go to the project directory

```bash
  cd Azon-Shop
```

Install dependencies

```bash
  npm install
```

Connect to your db, update drizzle integration if not using PostgreSQL

```bash
in .env
  POSTGRES_URL=
```

Add all the vars to the .env

## Set up Algolia

1. Go to `algoliaSeed.ts` and change `"azon1"` to your index name:

   ```typescript
   await client.saveObjects({ indexName: "azon1", objects: objectsToAdd });
   ```

2. Go to `Search.tsx` and change:

   - `sourceId: "AzonShop"` to your Algolia application name.
   - `indexName: "azon1"` to your index.

## Seeding the Database

Once you've completed the setup for Algolia and added the necessary environment variables, proceed with seeding your database with products.

**Seed the Database:** Run the following commands in your terminal:

```bash
 npm run db:productSeed
```

```bash
 npm run db:pricingSeed
```

```bash
 npm run db:ratingsSeed
```

```bash
 npm run db:algoliaSeed
```

### Checking the Changes

After the seeding process completes:

- **Algolia Dashboard:** Visit the Algolia dashboard to see your data indexed based on your seeding.

- **Drizzle Studio:** Access Drizzle Studio using the following command:

  ```bash
  npm run db:studio
  ```

  Use Drizzle Studio to examine your database and verify the seeded data.

Start the server

```bash
  npm run dev
```

# Tech stack

## V.2 (main branch)

**Client:** React, Next.js (app router), Shadcn, React Query, TailwindCSS, Clerk.
**Server:** Next.js, trpc, Drizzle ORM, PostgreSQL (Vercel DB).

## V.1 - older t3 stack

**Client:** React, React Query, TailwindCSS, nextauth.js.
**Server:** Next.js, trpc, prisma, planetscale.
(see v1 branch)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

## TODO

- [ ] Implement e2e testing with Cypress
  - [x] Write tests for the navigation bar
  - [x] Test adding a product to the cart.
  - [ ] Test FeaturedList component
  - [ ] Test Infinite loading in "all products"
  - [ ] Test mobile menu
  - [ ] Single product page
    - [ ] Test Quantity buttons
    - [ ] Test Description and Key benefits
- [ ] Quick buy feature w/ next.js modal setup
- [ ] Add metadata to each route
- [x] Move from Prizma to Drizzle ORM
- [x] Migrate from pages to app router (next js)
- [x] Use shadcn where reasonable
- [x] Integrate Sentry for error tracking
- [x] Algolia search
- [x] Discounts feature: discount component
- [x] Discounts feature: use discounted price on checkout and cart
- [x] Product description use accordion shadcn
