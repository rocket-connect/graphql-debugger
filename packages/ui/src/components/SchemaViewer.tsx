import { parse, print } from 'graphql';

export function SchemaViewer({ typeDefs }, { typeDefs: string }) {
  return (
    <div>
      <pre className="text-xs">{print(parse(typeDefs))}</pre>
    </div>
  );
}
