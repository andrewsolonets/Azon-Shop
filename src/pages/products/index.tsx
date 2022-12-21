import { Fragment, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "../../components/ProductCard";
import { LoadingSpinner } from "../../components/LoadingSpinner";

const AllPoductsPage = () => {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.product.getBatch.useInfiniteQuery(
      {
        limit: 8,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  // data will be split in pages
  return (
    <section className="mt-32 h-fit py-4 px-8">
      <div className="flex flex-col items-center justify-center">
        <h2 className="mb-8 text-3xl font-bold ">All Products</h2>
        <div className="grid auto-cols-max grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.pages.map((page) => (
            <Fragment key={page.nextCursor}>
              {page.items.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </Fragment>
          ))}

          <span style={{ visibility: "hidden" }} ref={ref}>
            intersection observer marker
          </span>
        </div>
        {isFetchingNextPage ? <LoadingSpinner /> : null}
      </div>
    </section>
  );
};

export default AllPoductsPage;