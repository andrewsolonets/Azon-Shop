"use client";

import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "~/components/ui/ProductCard";
import { api } from "~/trpc/react";

export default function AllProducts() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.product.getBatch.useInfiniteQuery(
      {
        limit: 8,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  // data will be split in pages
  return (
    <>
      <section className="mt-32 h-fit px-4 py-4 md:px-8">
        <div className="relative flex w-full flex-col items-center justify-center">
          <h2 className="mb-8 text-3xl font-bold">All Products</h2>
          <div className="grid auto-cols-max grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {data?.pages.map((page) => (
              <Fragment key={page.nextCursor}>
                {page.items.map((item) => (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  <ProductCard key={item.id} product={item} />
                ))}
              </Fragment>
            ))}

            <span style={{ visibility: "hidden" }} ref={ref}>
              intersection observer marker
            </span>
          </div>
          {isFetchingNextPage ? <div>Loading...</div> : null}
        </div>
      </section>
    </>
  );
}
