import {
  type FieldDefinitionNode,
  type ObjectTypeDefinitionNode,
  parse,
} from "graphql";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { SchemasContext } from "../../context/schemas";
import { IDS } from "../../testing";
import { GettingStarted } from "../sidebar/views/info/getting-started";
import { Type } from "./type";

function RenderSchema() {
  const schemasContext = useContext(SchemasContext);
  const schema = schemasContext?.schemaRef.current;
  const parsed = parse(schema?.typeDefs ?? "");

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
      id={IDS.schema.render}
      data-schemaid={schema?.id}
      data-typedefs={schema?.typeDefs}
      className="h-screen overflow-y-scroll custom-scrollbar py-2"
    >
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
                schemaId={schema?.id ?? ""}
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

export function SchemaViewer() {
  const navigate = useNavigate();
  const schemasContext = useContext(SchemasContext);
  const currentSchema = schemasContext?.schemaRef.current;

  return (
    <div
      id={IDS.sidebar.views.schemas}
      className="w-full"
      data-schema={currentSchema?.id as string}
    >
      <div className="flex flex-col gap-3 w-full mb-3">
        {schemasContext?.schemas?.length ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5">
              <ul className="flex flex-col gap-5 list-disc pl-5">
                {schemasContext?.schemas.map((schema) => (
                  <li
                    data-schemalistid={schema.id}
                    data-typedefs={schema.typeDefs}
                    key={schema.id}
                    onClick={() => {
                      navigate(`/schema/${schema.id}`);
                      schemasContext?.setSelectedSchema(schema);
                    }}
                    className={`text-sm hover:cursor-pointer ${
                      currentSchema?.id === schema.id ? "underline" : ""
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

      {currentSchema ? <RenderSchema /> : <></>}
    </div>
  );
}
