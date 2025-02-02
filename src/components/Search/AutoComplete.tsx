/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";
import { autocomplete, AutocompleteOptions } from "@algolia/autocomplete-js";
import React, {
  createElement,
  Fragment,
  useEffect,
  useRef,
  ReactElement,
} from "react";
import { createRoot } from "react-dom/client";

type AutocompleteProps = Partial<AutocompleteOptions<never>>; // Adjust type if known

export function Autocomplete(props: AutocompleteProps): ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRootRef = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const search = autocomplete({
      container: containerRef.current,
      placeholder: "Search for products",

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      renderer: { createElement, Fragment, render: () => {} },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          //@ts-expect-error current
          rootRef.current = root;
          //@ts-expect-error unmount
          panelRootRef.current?.unmount();
          //@ts-expect-error current
          panelRootRef.current = createRoot(root);
        }
        //@ts-expect-error current
        panelRootRef.current.render(children);
      },
      ...props,
    });

    return () => {
      search.destroy();
    };
  }, [props]);

  return (
    <div
      ref={containerRef}
      data-cy="search-box"
      className="w-fit flex-grow overflow-hidden bg-transparent text-violet-200"
    />
  );
}
