import { useContext } from "react";

import { rocketConnect } from "../../images";
import { SchemaViewer } from "../Schema";
import { ListSchema } from "../Schema/ListSchema";
import { SideBarContext } from "./SideBarContext";

export function SideBarView() {
  const sidebar = useContext(SideBarContext);

  const shouldDisplayLogo = ["no-schema", "schema-list", "info"].includes(
    sidebar?.view?.type || "",
  );

  return (
    <div className="h-screen flex flex-col items-start w-1/3 max-w-1/3 p-5 text-neutral-100 overflow-scroll">
      {sidebar?.view?.type === "no-schema" ? <div>no schema</div> : <></>}
      {sidebar?.view?.type === "schema-list" ? (
        <ListSchema
          schemas={sidebar.view?.schemas}
          isLoading={sidebar?.view?.isLoading}
        />
      ) : (
        <></>
      )}
      {sidebar?.view?.type === "schema" ? (
        <SchemaViewer
          typeDefs={sidebar?.view?.schema?.typeDefs}
          schemaId={sidebar?.view?.schema?.id}
        />
      ) : (
        <></>
      )}
      {shouldDisplayLogo ? (
        <div className="w-8 h-8 my-auto mx-auto">
          <a href="https://rocketconnect.co.uk">
            <img alt="made by rocketconnect" src={rocketConnect} />
          </a>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
