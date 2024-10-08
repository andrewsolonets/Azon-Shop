import * as React from "react";

function CartIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 41 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4.667 27.667v-23H.833V.833h5.75A1.917 1.917 0 018.5 2.75v23h23.84l3.833-15.333h-23.84V6.583H38.63a1.917 1.917 0 011.86 2.383l-4.793 19.167a1.917 1.917 0 01-1.859 1.45H6.583a1.917 1.917 0 01-1.916-1.916zM8.5 41.083a3.833 3.833 0 110-7.666 3.833 3.833 0 010 7.666zm23 0a3.834 3.834 0 110-7.667 3.834 3.834 0 010 7.667z" />
    </svg>
  );
}

export default CartIcon;
