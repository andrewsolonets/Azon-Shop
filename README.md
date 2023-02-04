
# Azon Shop

Ecommerce website built with t3-stack (typescript, prisma, trpc, next.js)


## Features

- Fully functioning, persistent Cart
- Infinite scroll 
- Rating System
- User profile with order history
- Checkout with Stripe
- Custom db with orders connected to Stripe
- Authentication
- Algolia Autocomplete search


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`NEXTAUTH_SECRET`

`NEXTAUTH_URL`

`GOOGLE_CLIENT_ID`

`GOOGLE_CLIENT_SECRET`

`GITHUB_ID`

`GITHUB_SECRET`

`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

`STRIPE_SECRET_KEY`

`STRIPE_WEBHOOK_SECRET`


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


Connect to your db, change schema.prisma if it's not mysql

```bash
in .env
  DATABASE_URL=
```

Add all the vars to the .env
    
    

Start the server

```bash
  npm run start
```


## Tech Stack

**Client:** React, React Query TailwindCSS, nextauth.js.

**Server:** Next.js, trpc, prisma, planetscale.

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
