import { DocumentNode, Kind, parse } from "graphql";

import { IDS } from "../../../../testing";
import { Selection } from "./selection";
import { QueryType } from "./type";

export function QueryViewer({ doc }: { doc: string }) {
  const ast: DocumentNode = parse(doc);

  return (
    <div id={IDS.trace.query} data-query={doc} className="flex-1 ">
      <pre className="text-xs flex flex-col gap-5">
        {ast?.definitions.map((def, index) => {
          if (def.kind === Kind.OPERATION_DEFINITION) {
            const kind = def.operation;

            const variableDefinitions = def.variableDefinitions
              ? def.variableDefinitions.map((varDef) => (
                  <div key={varDef.variable.name.value}>
                    <span className="text-graphql-otel-green">
                      ${varDef.variable.name.value}
                    </span>
                    : <QueryType type={varDef.type} />
                  </div>
                ))
              : null;

            return (
              <div key={index} className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-text-neutral-100">
                    <span className="text-graphiql-pink">{kind}</span>
                    {variableDefinitions?.length ? (
                      <span className="text-neutral-100">
                        {" "}
                        {"("}
                        <div className="flex flex-col ml-3">
                          {variableDefinitions}
                        </div>
                        {")"}
                      </span>
                    ) : (
                      <></>
                    )}
                    <span>{" {"}</span>
                  </span>
                </div>
                <div className="py-1 pl-2">
                  <ul className="flex flex-col gap-1">
                    {def.selectionSet.selections.map(
                      (selection, selectionIndex) => (
                        <Selection
                          selection={selection}
                          index={selectionIndex}
                          key={selectionIndex}
                        />
                      ),
                    )}
                  </ul>
                </div>

                <span className="text-neutral-100">{" }"}</span>
              </div>
            );
          }

          return null;
        })}
      </pre>
    </div>
  );
}
