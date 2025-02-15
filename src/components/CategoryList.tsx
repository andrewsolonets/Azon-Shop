import { db } from "~/server/db";
import { CategoryItem } from "./CategoryItem";

export default async function CategoryList() {
  const categories = await db.query.categories.findMany();

  return (
    <div
      data-cy="category-list"
      className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 [&>*:nth-child(1)]:col-span-2"
    >
      {categories?.map((category) => (
        <CategoryItem category={category} key={category.id} />
      ))}
    </div>
  );
}
