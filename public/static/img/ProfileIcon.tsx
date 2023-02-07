import * as React from "react";

function ProfileIcon(
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_97_222)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25 45.313c3.566.005 7.07-.933 10.156-2.72v-6.656a7.03 7.03 0 00-7.031-7.03h-6.25a7.03 7.03 0 00-7.031 7.03v6.657A20.219 20.219 0 0025 45.312zm14.844-9.376v2.929a20.313 20.313 0 10-29.688 0v-2.928A11.725 11.725 0 0117.925 24.9a9.375 9.375 0 1114.15 0 11.725 11.725 0 017.769 11.038zM25 50a25 25 0 100-50 25 25 0 000 50zm4.688-31.25a4.688 4.688 0 11-9.376 0 4.688 4.688 0 019.375 0z"
          fill="#FBBF24"
        />
      </g>
      <defs>
        <clipPath id="clip0_97_222">
          <path fill="#fff" d="M0 0H50V50H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default ProfileIcon;
