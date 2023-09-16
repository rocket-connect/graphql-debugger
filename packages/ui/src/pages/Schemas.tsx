import { TimeStamp } from "@graphql-debugger/time";
import { graphql } from "@graphql-debugger/types";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { listSchemas } from "../api/list-schemas";
import { IDS } from "../testing";
import { logo } from "../utils/images";

export function Schemas() {
  const [schemas, setSchemas] = useState<graphql.Schema[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const _schemas = await listSchemas();

        if (!_schemas.length) return;

        setSchemas(_schemas);
      } catch (error) {
        console.error(error);
        setSchemas([]);
      }
    })();
  }, []);

  return (
    <div className="flex h-screen justify-center items-center text-graphiql-light">
      {schemas?.length ? (
        <div
          id={IDS.SCHEMAS}
          className="mx-auto border border-graphiql-border rounded-lg shadow-md w-1/2 flex flex-col gap-6"
        >
          <div className="flex flex-row justify-between border-b border-graphiql-border gap-3 p-3">
            <div className="flex flex-col gap-3">
              <h1 className="text-bold text-2xl">Schemas</h1>
              <p className="text-sm">
                List of the GraphQL schemas picked up by GraphQL Debugger.
              </p>
            </div>

            <a
              href="https://github.com/rocket-connect/graphql-debugger"
              className="my-auto"
            >
              <div className="flex flex-row gap-2">
                <img id={IDS.LOGO} className="w-10" src={logo}></img>
                <p className="my-auto text-large font-bold">GraphQL Debugger</p>
              </div>
            </a>
          </div>
          <div className="relative">
            <table className="text-xs text-left w-full table-fixed">
              <colgroup>
                <col className="w-1/3" />
                <col className="w-1/3" />
                <col className="w-1/3" />
              </colgroup>
              <thead className="text-xs text-graphiql-light">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Hash
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody>
                {schemas.map((schema) => {
                  return (
                    <tr
                      key={schema.id}
                      className="border-b border-graphiql-border text-graphiql-light overflow-wrap break-words"
                    >
                      <th
                        scope="row"
                        className={`px-6 py-4 font-medium whitespace-nowrap`}
                      >
                        <Link
                          data-schemaId={schema.id}
                          to={`/schema/${schema.id}`}
                          className="text-graphiql-light underline "
                        >
                          {schema?.name || "Unknown"}
                        </Link>
                      </th>
                      <td className="px-6 py-4">{schema.hash}</td>
                      <td className="px-6 py-4">
                        {new TimeStamp(
                          new Date(schema.createdAt),
                        ).moment.fromNow()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          id={IDS.NO_SCHEMAS_FOUND}
          className="mx-auto border rounded-lg shadow-md p-8 w-96 flex flex-col gap-6"
        >
          <div className="flex flex-row gap-2 py-1 align-center mx-auto justify-center">
            <img id={IDS.LOGO} className="w-10 my-auto" src={logo}></img>
            <p className="my-auto text-large font-bold">GraphQL Debugger</p>
          </div>
          <p className="text-center text-lg">No Schemas found</p>
          <p className="text-center mt-2">
            <a
              href="https://github.com/rocket-connect/graphql-debugger"
              className="font-bold hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Github
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
