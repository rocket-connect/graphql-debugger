import { print, parse } from 'graphql';

export function QueryViewer({ doc }: { doc: string }) {
  const ast = parse(doc);
  const printed = print(ast);
  return (
    <div className="p-3 text-xs">
      <pre>{printed}</pre>
    </div>
  );
}
