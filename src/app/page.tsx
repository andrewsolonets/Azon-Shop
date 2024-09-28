import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { HeroSection } from "./_components/HeroSection";
import { FeaturedList } from "./_components/FeaturedList";
import { db } from "~/server/db";
import { products } from "~/server/db/schema";

export default async function Home() {
  // const hello = await api.post.hello({ text: "from tRPC" });
  const featuredProducts = await db.select().from(products).limit(20);

  // void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <>
        <HeroSection />

        <div className="px-4">
          <FeaturedList items={featuredProducts} />
        </div>
      </>
    </HydrateClient>
  );
}
