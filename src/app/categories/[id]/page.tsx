import { ProductCard } from "~/components/ui/ProductCard";
import { db } from "~/server/db";

export default async function SingleCategory({
  params: { id: id },
}: {
  params: { id: string };
}) {
  const category = await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.id, Number(id)),
    with: {
      products: {
        with: {
          reviews: true,
        },
      },
    },
  });
  console.log(category?.products);
  return (
    <>
      <section className="mt-32 flex h-fit flex-col gap-24 px-4 py-4 md:px-8">
        <h2 className="mb-8 text-3xl font-bold">{category?.name}</h2>
        <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4">
          {category?.products?.map((el) => (
            <ProductCard product={el} key={el.id} />
          ))}
        </div>
      </section>
    </>
  );
}
