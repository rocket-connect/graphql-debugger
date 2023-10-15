export function LinkedText({ text, href }: { text: string; href: string }) {
  return (
    <a className="underline hover:cursor-pointer font-bold" href={href}>
      {text}
    </a>
  );
}
