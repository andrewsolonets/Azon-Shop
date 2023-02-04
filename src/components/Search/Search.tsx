import { getAlgoliaResults } from "@algolia/autocomplete-js";
import algoliasearch from "algoliasearch/lite";
import { useRouter } from "next/router";
import { Autocomplete } from "./AutoComplete";
import { SearchItem } from "./SearchItem";

const searchClient = algoliasearch(
  "02IY9OU587",
  "4a4823810a947597ce43df859d1bdcd3"
  // Change key for search only on prod
);

export default function Search() {
  const router = useRouter();
  return (
    <Autocomplete
      classNames={{
        list: "",
        item: "",
        input: " text-zinc-500  xl:w-full",
        label: " ",
        button: "placeholder:opacity-0",
      }}
      getSources={({ query }: { query: string }) => [
        {
          sourceId: "AzonShop",
          getItems() {
            return getAlgoliaResults({
              searchClient,
              queries: [
                {
                  indexName: "azon1",
                  query,
                },
              ],
            });
          },
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          onSelect({ item }) {
            router.push(`/products/${item.id}`);
          },

          templates: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            item({ item, components }) {
              return <SearchItem hit={item} components={components} />;
            },
          },

          params: {
            attributesToSnippet: ["title"],
            hitsPerPage: 5,
            attributesToHighlight: ["title"],
          },
        },
      ]}
    />
  );
}
