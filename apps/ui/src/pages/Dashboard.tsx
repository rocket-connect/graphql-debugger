import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { client } from "../client";
import { ListSchema, SideBar } from "../components";
import { logo } from "../utils/images";

const { version } = require("../../package.json");

export function Dashboard() {
  const {
    data: schemas = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["schemas"],
    queryFn: async () => await client.schema.findMany(),
    networkMode: "always",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      if (!schemas.length) {
        refetch();
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [schemas, refetch]);

  return (
    <div className="h-screen flex-shrink-0 flex items-center gap-8 py-4 bg-white-100 overflow-hidden text-neutral-100">
      <SideBar isDashboard={true} isSchemaActive={false} />
      <ListSchema schemas={schemas} isLoading={isLoading} />
      <div className="flex flex-col gap-4 bg-neutral/5 rounded-2xl w-full h-full mx-4 shadow">
        <div className="flex align-center justify-center w-full h-full rounded-2xl">
          <div className="bg-gray-100 rounded-2xl py-10 px-28 mx-auto my-auto shadow">
            <div className="flex flex-col gap-5 text-center">
              <img className="w-12 mx-auto" src={logo}></img>
              <p className="text-xl font-bold">GraphQL Debugger</p>
              <a
                className="italic underline hover:cursor-pointer font-bold text-xs"
                href="https://www.graphql-debugger.com"
              >
                graphql-debugger.com
              </a>
              <p className="text-xs">{version}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
