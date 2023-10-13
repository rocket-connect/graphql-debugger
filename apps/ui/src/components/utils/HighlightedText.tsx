export function HighlightedText({
  text,
  color,
  spacing = "",
}: {
  text: string;
  color?: string;
  spacing?: string;
}) {
  return (
    <span className={`${color ? `text-${color}` : ""} font-bold`}>
      {spacing}
      {text}
      {spacing}
    </span>
  );
}
