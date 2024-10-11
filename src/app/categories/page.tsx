import { Metadata } from "next";
import CategoryList from "~/components/CategoryList";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function Categories() {
  return (
    <section className="mt-12 h-fit px-8 py-4">
      <h2 className="mb-8 text-3xl font-bold">All Categories</h2>
      <CategoryList />
    </section>
  );
}
