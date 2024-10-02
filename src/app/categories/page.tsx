import { CategoryList } from "~/components/CategoryList";

export default async function Categories() {
  return (
    <section className="mt-32 h-fit px-8 py-4">
      <h2 className="mb-8 text-3xl font-bold">All Categories</h2>
      <CategoryList />
    </section>
  );
}