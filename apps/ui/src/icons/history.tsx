import { IconProps } from "./types";

export function HistoryActive({ size, color }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      height={size || "1em"}
      width={size || "1em"}
    >
      <path d="M12 2a10 10 0 00-6.88 2.77V3a1 1 0 00-2 0v4.5a1 1 0 001 1h4.5a1 1 0 000-2h-2.4A8 8 0 114 12a1 1 0 00-2 0A10 10 0 1012 2zm0 6a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 000-2h-1V9a1 1 0 00-1-1z" />
    </svg>
  );
}

export function History({ size, color }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={color}
      height={size || "1em"}
      width={size || "1em"}
    >
      <path d="M11.44 2a10 10 0 00-6.88 2.77V3a1 1 0 00-2 0v4.5a1 1 0 001 1h4.5a1 1 0 000-2h-2.4A8 8 0 1111.44 20a1 1 0 100 2 10 10 0 100-20zm0 6a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 000-2h-1V9a1 1 0 00-1-1z" />
    </svg>
  );
}
