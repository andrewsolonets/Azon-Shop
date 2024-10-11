import * as React from "react";

function ArrowIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M24.61 7.184L36.983 19.56c.188.188.321.39.4.61.077.218.116.453.116.703 0 .25-.039.484-.116.703a1.656 1.656 0 01-.4.61L24.61 34.558c-.343.344-.773.524-1.288.54a1.75 1.75 0 01-1.337-.54 1.755 1.755 0 01-.587-1.288 1.75 1.75 0 01.54-1.337l9.188-9.187H10.172c-.531 0-.977-.18-1.337-.538-.359-.36-.538-.806-.538-1.337 0-.532.18-.977.538-1.335.36-.36.806-.54 1.337-.54h20.953l-9.188-9.188c-.343-.344-.523-.781-.54-1.312-.014-.532.166-.97.54-1.313.344-.375.782-.562 1.313-.562.531 0 .984.187 1.36.562z" />
    </svg>
  );
}

export default ArrowIcon;
