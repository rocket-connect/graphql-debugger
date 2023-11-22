import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { IconProps, IconRef } from "./types";

export const ExpandIcon = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    fill="currentColor"
    viewBox="0 0 16 16"
    className={twMerge("text-neutral fill-neutral", props.className)}
    height={props.height || 30}
    width={props.width || 30}
    {...props}
    ref={ref}
  >
    <path
      fillRule="evenodd"
      d="M5.828 10.172a.5.5 0 00-.707 0l-4.096 4.096V11.5a.5.5 0 00-1 0v3.975a.5.5 0 00.5.5H4.5a.5.5 0 000-1H1.732l4.096-4.096a.5.5 0 000-.707zm4.344-4.344a.5.5 0 00.707 0l4.096-4.096V4.5a.5.5 0 101 0V.525a.5.5 0 00-.5-.5H11.5a.5.5 0 000 1h2.768l-4.096 4.096a.5.5 0 000 .707z"
    />
  </svg>
));
