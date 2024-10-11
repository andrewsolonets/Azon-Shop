import * as React from "react";

function PlusIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10.75 17.5h2.5v-5h5V10h-5V5h-2.5v5h-5v2.5h5v5zm-7.5 5a2.41 2.41 0 01-1.766-.734A2.41 2.41 0 01.75 20V2.5c0-.688.245-1.276.734-1.766A2.41 2.41 0 013.25 0h17.5a2.41 2.41 0 011.766.734c.49.49.734 1.079.734 1.766V20a2.41 2.41 0 01-.734 1.766 2.41 2.41 0 01-1.766.734H3.25zm0-2.5h17.5V2.5H3.25V20z" />
    </svg>
  );
}

export default PlusIcon;
