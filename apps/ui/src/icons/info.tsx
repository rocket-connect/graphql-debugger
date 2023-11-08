import { forwardRef } from "react";

import { IconProps, IconRef } from "./types";

export const Info = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    viewBox="64 64 368 368"
    height={props.height || 30}
    ref={ref}
    width={props.width || 30}
    className={props.className || "fill-neutral-100"}
  >
    <path
      fill="none"
      className={props.className || "stroke-neutral-100"}
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
    />
    <path
      fill="none"
      className={props.className || "stroke-neutral-100"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M220 220h32v116"
    />
    <path
      fill="none"
      stroke="currentColor"
      className={props.className || "stroke-neutral-100"}
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={32}
      d="M208 340h88"
    />
    <path d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
  </svg>
));

export const InfoFilled = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    viewBox="56 56 400 400"
    ref={ref}
    height={props.height || 30}
    width={props.width || 30}
    className={props.className || "fill-neutral-100"}
    {...props}
  >
    <path d="M256 56C145.72 56 56 145.72 56 256s89.72 200 200 200 200-89.72 200-200S366.28 56 256 56zm0 82a26 26 0 11-26 26 26 26 0 0126-26zm64 226H200v-32h44v-88h-32v-32h64v120h44z" />
  </svg>
));
