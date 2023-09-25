import { FieldDefinitionNode, ObjectTypeDefinitionNode, parse } from "graphql";

import { Type } from "./Type";

export function SchemaViewer({
  schemaId,
  typeDefs,
}: {
  schemaId: string;
  typeDefs: string;
}) {
  const parsed = parse(typeDefs);

  const queryDefs: ObjectTypeDefinitionNode[] = [];
  const mutationDefs: ObjectTypeDefinitionNode[] = [];
  const otherDefs: ObjectTypeDefinitionNode[] = [];

  parsed.definitions.forEach((def) => {
    if (def.kind === "ObjectTypeDefinition") {
      if (def.name.value === "Query") {
        queryDefs.push(def);
      } else if (def.name.value === "Mutation") {
        mutationDefs.push(def);
      } else {
        otherDefs.push(def);
      }
    }
  });

  const sortedDefs = [...queryDefs, ...mutationDefs, ...otherDefs];

  return (
    <div className="flex-1 overflow-y-auto">
      <pre className="text-xs flex flex-col gap-5">
        {sortedDefs.map((def, index) => {
          if (
            def.kind === "ObjectTypeDefinition" ||
            def.kind === "InputObjectTypeDefinition"
          ) {
            const name = def.name.value;
            const kind = def.kind;

            return (
              <div className="flex flex-col" key={def.name.value}>
                <Type
                  schemaId={schemaId}
                  key={index}
                  type={{
                    name,
                    kind,
                    fields: def.fields as FieldDefinitionNode[],
                  }}
                />
              </div>
            );
          }

          return null;
        })}
      </pre>
    </div>
  );
}
