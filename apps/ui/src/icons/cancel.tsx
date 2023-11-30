import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import { IconProps, IconRef } from "./types";

export const Cancel = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    viewBox="5.84 5.84 12.31 12.31"
    {...props}
    height={props.height || 30}
    width={props.width || 30}
    className={twMerge(
      "fill-neutral text-neutral stroke-neutral",
      props.className,
    )}
    ref={ref}
  >
    <g clipRule="evenodd" fill="rgb(0,0,0)" fillRule="evenodd">
      <path d="m5.98959 5.98959c.19526-.19527.51184-.19527.7071 0l11.31371 11.31371c.1953.1953.1953.5118 0 .7071s-.5118.1953-.7071 0l-11.31371-11.31371c-.19527-.19526-.19527-.51184 0-.7071z"></path>
      <path d="m18.0104 5.98959c.1953.19526.1953.51184 0 .7071l-11.31371 11.31371c-.19526.1953-.51184.1953-.7071 0-.19527-.1953-.19527-.5118 0-.7071l11.31371-11.31371c.1953-.19527.5118-.19527.7071 0z"></path>
    </g>
  </svg>
));
