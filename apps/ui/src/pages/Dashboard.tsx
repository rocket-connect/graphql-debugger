import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";

import { client } from "../client";
import { SideBarContext } from "../components/SideBar/SideBarContext";
import { Page } from "../components/utils/Page";
import { logo } from "../utils/images";

const { version } = require("../../package.json");

export function Dashboard() {
  const sidebar = useContext(SideBarContext);
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

  useEffect(() => {
    if (sidebar) {
      if (schemas.length) {
        if (sidebar.view?.type !== "schema-list") {
          sidebar?.open({
            type: "schema-list",
            schemas,
            isLoading,
          });
        }
      } else {
        if (sidebar.view?.type !== "no-schema") {
          sidebar?.open({
            type: "no-schema",
            isLoading,
          });
        }
      }
    }
  }, [schemas, isLoading, sidebar]);

  return (
    <Page>
      <div className="rounded-2xl py-10 px-28 mx-auto my-auto shadow">
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
    </Page>
  );
}
