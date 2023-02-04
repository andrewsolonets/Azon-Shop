/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

import Link from "next/link";

export function SearchItem({ hit, components }) {
  return (
    <Link href={`/products/${hit.id}`} className="aa-ItemLink">
      <div className="aa-ItemContent">
        <div className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute="title" />
        </div>
      </div>
    </Link>
  );
}
