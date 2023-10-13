import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { client } from "../client";
import { Trace } from "../components";
import { SideBarContext } from "../components/SideBar/SideBarContext";
import { Page } from "../components/utils/Page";
import { DEFAULT_SLEEP_TIME, sleep } from "../utils/sleep";

export function Schema() {
  const sidebar = useContext(SideBarContext);
  const navigate = useNavigate();
  const params = useParams();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["singleSchema"],
    queryFn: async () => {
      const schemas = await client.schema.findMany({
        where: {
          id: params.schemaId,
        },
      });

      await sleep(DEFAULT_SLEEP_TIME);

      return schemas;
    },
    select: (data) => {
      return data.find(({ id }) => id === params.schemaId);
    },
    networkMode: "always",
  });

  useEffect(() => {
    if (!isLoading) {
      if (!schema) {
        navigate("/");
      }
    }

    if (schema) {
      if (sidebar?.view?.type !== "schema") {
        sidebar?.open({
          type: "schema",
          schema,
        });
      }
    }
  }, [isLoading, schema, navigate, sidebar]);

  return (
    <Page>
      <Trace />
    </Page>
  );
}
