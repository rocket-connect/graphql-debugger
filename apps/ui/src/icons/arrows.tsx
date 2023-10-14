import { IconProps } from "./types";

export const UpArrow = (props: IconProps) => {
  return (
    <svg
      width={props.size || "14"}
      height={props.size || "9"}
      viewBox="0 0 14 9"
      fill="none"
      role="button"
    >
      <path
        d="M13 8L7 2L1 8"
        stroke="#3B4B68"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
    </svg>
  );
};

export const DownArrow = (props: IconProps) => {
  return (
    <svg
      width={props.size || "14"}
      height={props.size || "9"}
      viewBox="0 0 14 9"
      fill="none"
      role="button"
    >
      <path
        d="M1 0.999999L7 7L13 1"
        stroke="#3B4B68"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />
    </svg>
  );
};
