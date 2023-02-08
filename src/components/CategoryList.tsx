import { api } from "../utils/api";
import { CategoryItem } from "./CategoryItem";

export const CategoryList = () => {
  const categories = api.category.getAllCategories.useQuery(undefined, {
    staleTime: Infinity,
  });

  return (
    <div
      className="grid w-full grid-cols-1 gap-4
      md:grid-cols-2 [&>*:nth-child(1)]:col-span-2"
    >
      {categories?.data?.map((item) => (
        <CategoryItem name={item.name} id={item.id} key={item.id} />
      ))}
    </div>
  );
};
