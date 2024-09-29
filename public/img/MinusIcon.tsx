import * as React from "react";

function MinusIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10 12.5h7.5V10H5v2.5h5zm-7.5 10a2.41 2.41 0 01-1.766-.734A2.41 2.41 0 010 20V2.5C0 1.812.245 1.224.734.734A2.41 2.41 0 012.5 0H20a2.41 2.41 0 011.766.734c.49.49.734 1.079.734 1.766V20a2.41 2.41 0 01-.734 1.766A2.41 2.41 0 0120 22.5H2.5zm0-2.5H20V2.5H2.5V20z" />
    </svg>
  );
}

export default MinusIcon;
