/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck

export function SearchItem({ hit, components }) {
  return (
    <div className="aa-ItemContent">
      <div className="aa-ItemTitle">
        <components.Highlight hit={hit} attribute="title" />
      </div>
    </div>
  );
}
