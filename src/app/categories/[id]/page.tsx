import { ProductCard } from "~/components/ui/ProductCard";
import { db } from "~/server/db";
import { getCategory } from "~/server/queries";

export async function generateMetadata({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const category = await getCategory(Number(id));

  return {
    title: category.name,
  };
}

export default async function SingleCategory({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const category = await getCategory(Number(id));
  console.log(category?.products);
  return (
    <>
      <section className="mt-12 flex h-fit flex-col gap-6 px-4 py-4 md:px-8">
        <h2 className="mb-8 text-3xl font-bold">{category?.name}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {category?.products?.map((el) => (
            <ProductCard product={el} key={el.id} />
          ))}
        </div>
      </section>
    </>
  );
}
