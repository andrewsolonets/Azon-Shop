"use client";
import {
  getAlgoliaResults,
  PublicAutocompleteComponents,
} from "@algolia/autocomplete-js";
import { algoliasearch, SearchClient } from "algoliasearch"; // Import correct type
import { useRouter } from "next/navigation";
import { Autocomplete } from "./AutoComplete";
import { SearchItem } from "./SearchItem";
import { env } from "~/env";
import { useRef } from "react";

const searchClient: SearchClient = algoliasearch(
  // Explicitly typing SearchClient
  env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  env.NEXT_PUBLIC_SEARCH_ALGOLIA_KEY,
);

export default function Search() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the input field

  return (
    <Autocomplete
      //@ts-expect-error inputRef
      inputRef={inputRef}
      classNames={{
        list: "",
        item: "[&>div>mark]:text-violet-800",
        form: "bg-violet-50",
        input: " text-violet-700  xl:w-full",
        label: " ",
        panel: "bg-violet-50 text-violet-700 ",
        // button: "placeholder:opacity-0",
      }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      getSources={({
        query,
        setQuery,
      }: {
        query: string;
        setQuery: (str: string) => void;
      }) => [
        {
          sourceId: "AzonShop",
          getItems() {
            return getAlgoliaResults({
              //@ts-expect-error search client type
              searchClient,
              queries: [
                {
                  indexName: "azon1",
                  params: {
                    query,
                  },
                },
              ],
            });
          },
          onSelect({ item }: { item: { id: string } }) {
            router.push(`/products/${item.id}`);
            setQuery("");

            if (inputRef.current) {
              inputRef.current.blur();
            }
          },
          templates: {
            item({
              item,
              components,
            }: {
              item: never;
              components: PublicAutocompleteComponents;
            }) {
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
