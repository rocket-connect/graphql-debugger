import { TimeStamp } from "@graphql-debugger/time";
import { Schema } from "@graphql-debugger/types";

import { Link } from "react-router-dom";

import { rocketConnect } from "../../images";
import { IDS } from "../../testing";
import { Help } from "../info/Help";
import { HowItWorks } from "../info/HowItWorks";
import { MadeWith } from "../info/MadeWith";
import { NoSchemasFound } from "../info/NoSchemasFound";

export const ListSchema = ({
  schemas,
  isLoading,
}: {
  schemas: Schema[];
  isLoading?: boolean;
}) => {
  return (
    <div
      id={IDS.SCHEMAS}
      className="h-screen flex flex-col items-start w-96 max-w-96 py-5 text-neutral-100 overflow-scroll"
    >
      <div>
        <h2 className="font-bold">Schemas</h2>
        <p className="pt-2 text-xs">List of all your GraphQL Schemas.</p>
      </div>

      {isLoading ? (
        <></>
      ) : (
        <div className="flex flex-col w-full">
          {schemas.length ? (
            <div className="bg-red rounded-2xl bg-neutral/5 my-10 py-5 shadow">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {schemas?.map((schema) => {
                    return (
                      <tr
                        key={schema.id}
                        className={`border-graphiql-neutral/10 hover:cursor-pointer text-center`}
                      >
                        <td className="p-3">
                          <Link
                            data-schemaId={schema.id}
                            to={`/schema/${schema.id}`}
                            className="text-neutral-500 underline "
                          >
                            {schema?.name || "Unknown"}
                          </Link>
                        </td>
                        <td className="p-3">
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
          ) : (
            <></>
          )}

          {!schemas.length && !isLoading && (
            <div className="mt-5">
              <NoSchemasFound />
            </div>
          )}

          <div className="flex flex-col gap-5">
            {schemas.length && !isLoading ? (
              <HowItWorks />
            ) : (
              <div>{/* Empty div for gap */}</div>
            )}
            <Help />
            <MadeWith />
          </div>
        </div>
      )}

      <div className="w-8 h-8 my-auto mx-auto">
        <a href="https://rocketconnect.co.uk">
          <img alt="made by rocketconnect" src={rocketConnect} />
        </a>
      </div>
    </div>
  );
};
