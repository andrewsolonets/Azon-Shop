import { useRouter } from "next/router";
import { ProductCard } from "../../components/ProductCard";
import { trpc } from "../../utils/trpc";

const SingleCategory = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = trpc.category.getOneCategory.useQuery(id as string);
  return (
    <section className="mt-32 h-fit py-4 px-8">
      <h2 className="mb-8 text-3xl font-bold">{data?.name}</h2>
      <div className="grid grid-cols-5 gap-4">
        {data?.products?.map((el) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          <ProductCard product={el} key={el.id} />
        ))}
      </div>
    </section>
  );
};
export default SingleCategory;
