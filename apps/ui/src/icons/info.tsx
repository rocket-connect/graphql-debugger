import { forwardRef } from "react";

import { IconProps, IconRef } from "./types";

export const Info = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    className="text-neutral-100 "
    height={props.height || 30}
    ref={ref}
    width={props.width || 30}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 20 20"
  >
    <path
      className={props.className || "stroke-neutral-100"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
));

export const InfoFilled = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    ref={ref}
    height={props.height || 30}
    width={props.width || 30}
    className={props.className || "fill-neutral-100 text-neutral-100"}
    {...props}
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
  </svg>
));
