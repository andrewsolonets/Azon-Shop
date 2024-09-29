import * as React from "react";

function GithubIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 27 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M10.284 19.792c-4.57 1.458-4.57-2.605-6.377-3.125m12.754 5.208v-3.646c0-1.041.106-1.458-.531-2.083 2.976-.313 5.846-1.459 5.846-6.25a4.742 4.742 0 00-1.382-3.333 4.295 4.295 0 00-.107-3.334s-1.169-.312-3.72 1.354a13.33 13.33 0 00-6.59 0c-2.55-1.666-3.72-1.354-3.72-1.354a4.295 4.295 0 00-.106 3.334A4.742 4.742 0 004.97 9.896c0 4.791 2.87 5.937 5.846 6.25-.638.625-.638 1.25-.532 2.083v3.646" />
    </svg>
  );
}

export default GithubIcon;
