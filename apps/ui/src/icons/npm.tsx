import { forwardRef } from "react";

import type { IconProps, IconRef } from "./types";

export const NpmIcon = forwardRef((props: IconProps, ref: IconRef) => (
  //   <svg
  //     data-name="Layer 1"
  //     viewBox="0 0 512 512"
  //     height={props.height || 30}
  //     ref={ref}
  //     width={props.width || 30}
  //     className={props.className || "fill-neutral-100"}
  //     {...props}
  //   >
  //     <path d="M227.6 213.1H256v57.1h-28.4z" />
  //     <path d="M0 156v171.4h142.2V356H256v-28.6h256V156zm142.2 142.9h-28.4v-85.7H85.3v85.7H28.4V184.6h113.8zm142.2 0h-56.9v28.6h-56.9V184.6h113.8zm199.2 0h-28.4v-85.7h-28.4v85.7h-28.4v-85.7H370v85.7h-56.9V184.6h170.7v114.3z" />
  //   </svg>

  <svg
    viewBox="0 160 576 224"
    height={props.height || 30}
    ref={ref}
    width={props.width || 30}
    className={props.className || "fill-neutral-100"}
    {...props}
  >
    <path d="M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z" />
  </svg>
));
