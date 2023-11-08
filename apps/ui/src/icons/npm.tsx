import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

import type { IconProps, IconRef } from "./types";

export const NpmIcon = forwardRef((props: IconProps, ref: IconRef) => (
  <svg
    viewBox="0 160 576 224"
    height={props.height || 30}
    ref={ref}
    width={props.width || 30}
    className={twMerge("fill-neutral-100", props.className)}
    {...props}
  >
    <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z" />
  </svg>
));
