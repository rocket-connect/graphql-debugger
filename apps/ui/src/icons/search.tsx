import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { IconProps, IconRef } from "./types";

export const Search = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    className={twMerge("text-neutral fill-neutral", props.className)}
    height={props.height || 30}
    width={props.width || 30}
    {...props}
    ref={ref}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M18.319 14.433A8.001 8.001 0 006.343 3.868a8 8 0 0010.564 11.976l.043.045 4.242 4.243a1 1 0 101.415-1.415l-4.243-4.242a1.116 1.116 0 00-.045-.042zm-2.076-9.15a6 6 0 11-8.485 8.485 6 6 0 018.485-8.485z"
      clipRule="evenodd"
    />
  </svg>
));
