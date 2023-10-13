import {
  type FieldDefinitionNode,
  type ObjectTypeDefinitionNode,
  parse,
} from "graphql";
import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SchemasContext } from "../../context/schemas";
import { IDS } from "../../testing";
import { GettingStarted } from "../info/GettingStarted";
import { Type } from "./Type";

function RenderSchema() {
  const schemasContext = useContext(SchemasContext);
  const parsed = parse(schemasContext?.selectedSchema?.typeDefs ?? "");

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
                schemaId={schemasContext?.selectedSchema?.id ?? ""}
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
  );
}

export const SchemaViewer = () => {
  const schemasContext = useContext(SchemasContext);
  const navigate = useNavigate();

  const setSelectedSchema = useCallback(
    (schema) => {
      schemasContext?.setSchema(schema);
      navigate(`/schema/${schema.id}`);
    },
    [schemasContext, navigate],
  );

  return (
    <div
      id={IDS.SCHEMA}
      className="w-full"
      data-schema={schemasContext?.selectedSchema?.id as string}
    >
      <div className="flex flex-col gap-3 w-full mb-3">
        {schemasContext?.schemas?.length ? (
          <div className="flex flex-col gap-5">
            <h2 className="text-neutral-100 font-bold">Schema</h2>
            <div className="flex flex-col gap-5">
              {!schemasContext?.selectedSchema ? (
                <p className="italic text-sm">Select a GraphQL Schema.</p>
              ) : (
                <></>
              )}
              <ul className="flex flex-col gap-5 list-disc pl-5">
                {schemasContext?.schemas.map((schema) => (
                  <li
                    key={schema.id}
                    onClick={() => setSelectedSchema(schema)}
                    className={`text-sm font-bold hover:cursor-pointer ${
                      schemasContext?.selectedSchema?.id === schema.id
                        ? "underline"
                        : ""
                    }`}
                  >
                    {schema.name || "Untitled Schema"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <GettingStarted />
        )}
      </div>

      {schemasContext?.selectedSchema ? RenderSchema() : <></>}
    </div>
  );
};
