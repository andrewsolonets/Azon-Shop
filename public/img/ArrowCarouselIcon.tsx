import * as React from "react";

function ArrowCarouselIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18.922 6.565L36.12 23.71c.204.204.348.425.432.663.086.239.129.494.129.766s-.043.527-.129.765a1.78 1.78 0 01-.432.664L18.922 43.766c-.476.476-1.071.714-1.786.714a2.506 2.506 0 01-1.837-.765c-.51-.51-.765-1.106-.765-1.786 0-.68.255-1.276.765-1.786L30.302 25.14 15.3 10.137c-.476-.476-.714-1.063-.714-1.76 0-.698.255-1.302.765-1.812s1.106-.766 1.786-.766c.68 0 1.276.255 1.786.766z" />
    </svg>
  );
}

export default ArrowCarouselIcon;
