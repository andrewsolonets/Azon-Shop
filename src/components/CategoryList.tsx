import { db } from "~/server/db";
import { CategoryItem } from "./CategoryItem";

export const CategoryList = async () => {
  const categories = await db.query.categories.findMany();

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 [&>*:nth-child(1)]:col-span-2">
      {categories?.map((category) => <CategoryItem category={category} />)}
    </div>
  );
};
