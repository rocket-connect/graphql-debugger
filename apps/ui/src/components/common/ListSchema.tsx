import { TimeStamp } from "@graphql-debugger/time";
import type { Schema } from "@graphql-debugger/types";

import { Link } from "react-router-dom";

import { IDS } from "../../testing";
import { logo } from "../../utils/images";

export const ListSchema = ({ schemas }: { schemas?: Schema[] }) => {
  return (
    <div
      id={IDS.SCHEMAS}
      className="mx-auto  rounded-lg shadow-xl shadow-gray-300 w-1/2 flex flex-col gap-6"
    >
      <div className="flex flex-row justify-between gap-3 p-3">
        <div className="flex flex-col gap-3">
          <h1 className="text-bold text-2xl text-neutral-100">Schemas</h1>
          <p className="text-sm text-neutral-100">
            List of the GraphQL schemas picked up by GraphQL Debugger.
          </p>
        </div>

        <a
          href="https://github.com/rocket-connect/graphql-debugger"
          className="my-auto"
        >
          <div className="flex flex-row gap-2">
            <img id={IDS.LOGO} className="w-10" src={logo}></img>
            <p className="my-auto text-large text-neutral-100 font-bold">
              GraphQL Debugger
            </p>
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
          <thead className="text-xs text-neutral-100">
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
            {schemas?.map((schema) => {
              return (
                <tr
                  key={schema.id}
                  className="text-neutral-500 overflow-wrap break-words"
                >
                  <th
                    scope="row"
                    className={`px-6 py-4 font-medium whitespace-nowrap`}
                  >
                    <Link
                      data-schemaId={schema.id}
                      to={`/test/${schema.id}`}
                      className="text-neutral-500 underline "
                    >
                      {schema?.name || "Unknown"}
                    </Link>
                  </th>
                  <td className="px-6 py-4">{schema.hash}</td>
                  <td className="px-6 py-4">
                    {new TimeStamp(new Date(schema.createdAt)).moment.fromNow()}
                  </td>
                </tr>
              );
            })}
            {schemas?.map((schema) => {
              return (
                <tr
                  key={schema.id}
                  className="text-neutral-500 overflow-wrap break-words"
                >
                  <th
                    scope="row"
                    className={`px-6 py-4 font-medium whitespace-nowrap`}
                  >
                    <Link
                      data-schemaId={schema.id}
                      to={`/schema/${schema.id}`}
                      className="text-neutral-500 underline "
                    >
                      {schema?.name || "Unknown"}
                    </Link>
                  </th>
                  <td className="px-6 py-4">{schema.hash}</td>
                  <td className="px-6 py-4">
                    {new TimeStamp(new Date(schema.createdAt)).moment.fromNow()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
