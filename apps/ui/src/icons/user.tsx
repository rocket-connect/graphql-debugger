import { forwardRef } from "react";

import type { IconProps, IconRef } from "./types";

export const User = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    viewBox="0 0 512 512"
    width={props.width || 30}
    className={props.className || "fill-neutral-100"}
    ref={ref}
    {...props}
  >
    <path d="M256 112c-48.6 0-88 39.4-88 88s39.4 88 88 88 88-39.4 88-88-39.4-88-88-88zm0 128c-22.06 0-40-17.95-40-40 0-22.1 17.9-40 40-40s40 17.94 40 40c0 22.1-17.9 40-40 40zm0-240C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 464c-46.73 0-89.76-15.68-124.5-41.79C148.8 389 182.4 368 220.2 368h71.69c37.75 0 71.31 21.01 88.68 54.21C345.8 448.3 302.7 464 256 464zm160.2-75.5c-27-42.2-73-68.5-124.4-68.5h-71.6c-51.36 0-97.35 26.25-124.4 68.48C65.96 352.5 48 306.3 48 256c0-114.7 93.31-208 208-208s208 93.31 208 208c0 50.3-18 96.5-47.8 132.5z" />
  </svg>
));

export const UserFilled = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    viewBox="0 0 512 512"
    width={props.width || 30}
    className={props.className || "fill-neutral-100"}
    ref={ref}
    {...props}
  >
    <path d="M399 384.2c-22.1-38.4-63.6-64.2-111-64.2h-64c-47.4 0-88.9 25.8-111 64.2 35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM512 256c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256zm-256 16c39.8 0 72-32.2 72-72s-32.2-72-72-72-72 32.2-72 72 32.2 72 72 72z" />
  </svg>
));
