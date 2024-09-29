import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedList } from "./_components/FeaturedList";
import { db } from "~/server/db";
import { products, ratings } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getFeaturedProducts } from "~/server/queries";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const featuredProducts = getFeaturedProducts();
  // console.log(featuredProducts);
  // void api.post.getLatest.prefetch();

  return (
    <main className="">
      <HeroSection />

      <div className="px-4">
        <FeaturedList items={featuredProducts} />
      </div>
    </main>
  );
}
