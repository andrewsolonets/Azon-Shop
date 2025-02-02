"use client";

import { PublicAutocompleteComponents } from "@algolia/autocomplete-js";

interface SearchItemProps {
  hit: never; // Define hit type based on the structure
  components: PublicAutocompleteComponents; // Define the component type if known, otherwise `any`
}

export function SearchItem({ hit, components }: SearchItemProps) {
  return (
    <div data-cy="search-item" className="aa-ItemContent">
      <div className="aa-ItemTitle">
        {components.Highlight ? (
          <components.Highlight
            className="text-violet-800"
            hit={hit}
            attribute="title"
          />
        ) : null}
      </div>
    </div>
  );
}
