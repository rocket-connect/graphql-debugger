import {
  type FieldDefinitionNode,
  type ObjectTypeDefinitionNode,
  parse,
} from "graphql";

import { IDS } from "../../testing";
import { Type } from "./Type";
import type { SchemaViewerProps } from "./types";

export const SchemaViewer = ({ schemaId, typeDefs }: SchemaViewerProps) => {
  const parsed = parse(typeDefs ?? "");

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
    <div
      className="h-screen flex flex-col items-start"
      id={IDS.SCHEMA}
      data-schema={schemaId}
    >
      <div className="pt-2">
        <h2 className="text-neutral-100 font-bold">Schema</h2>
        <p className="text-neutral-100 py-2 text-xs">
          Your GraphQL Schema with analytics on each field.
        </p>
      </div>

      <div className="h-screen overflow-y-scroll custom-scrollbar py-2">
        {sortedDefs.map((def, index) => {
          if (
            def.kind === "ObjectTypeDefinition" ||
            def.kind === "InputObjectTypeDefinition"
          ) {
            const name = def.name.value;
            const kind = def.kind;

            return (
              <div key={def.name.value} className="mb-4">
                <Type
                  schemaId={schemaId ?? ""}
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
      </div>
    </div>
  );
};
