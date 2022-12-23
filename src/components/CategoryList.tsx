import { trpc } from "../utils/trpc";
import { CategoryItem } from "./CategoryItem";

export const CategoryList = () => {
  const categories = trpc.category.getAllCategories.useQuery(undefined, {
    staleTime: Infinity,
  });

  return (
    <div className="grid w-full grid-cols-2 gap-4 [&>*:nth-child(1)]:col-span-2">
      {categories?.data?.map((item, i) => (
        <CategoryItem name={item.name} id={item.id} key={item.id} />
      ))}
    </div>
  );
};
