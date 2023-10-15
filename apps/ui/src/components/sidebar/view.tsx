import { useContext } from "react";

import { SchemasContext } from "../../context/schemas";
import { SideBarContext } from "../../context/sidebar";
import { upperFirst } from "../../utils/upper-first";
import { SchemaViewer } from "../schema/viewer";
import { Config } from "./views/config";
import { Info } from "./views/info/info";
import { InfoLogo } from "./views/info/info-logo";
import { Login } from "./views/login";

export function SideBarView() {
  const sidebarContext = useContext(SideBarContext);
  const schemasContext = useContext(SchemasContext);

  if (!sidebarContext?.isOpened) {
    return <></>;
  }

  const viewType = sidebarContext?.view?.type || "";

  const shouldDisplayLogo = ["login", "info"].includes(viewType);
  const shouldDisplayHeader = !["info"].includes(viewType);

  let description = "";

  switch (sidebarContext?.view?.type) {
    case "schema":
      if (schemasContext?.schemaRef.current) {
        description = "Your GraphQL Schema, with analytics and traces";
      } else {
        description = "Select a GraphQL Schema to start exploring your traces";
      }
      break;
    case "info":
      // Nothing to do here - we just display the logo
      break;
    case "config":
      description =
        "Configure GraphQL debugger settings, stored in your browser";
      break;
    case "login":
      description =
        "Login to GraphQL Debugger Cloud to access your projects, view production traces and collaborate with your team";
      break;
    default:
      description = "";
      break;
  }

  return (
    <div className="h-screen flex flex-col items-start w-2/6 max-w-2/6 p-5 text-neutral-100 overflow-scroll gap-5 custom-scrollbar">
      {shouldDisplayLogo ? (
        <div className="mx-auto">
          <InfoLogo />
        </div>
      ) : (
        <></>
      )}
      {shouldDisplayHeader ? (
        <div className="flex flex-col gap-3">
          <h2 className="font-bold">
            {upperFirst(sidebarContext.view?.type || "")}
          </h2>
          <p className="text-xs">{description}.</p>
        </div>
      ) : (
        <></>
      )}
      {sidebarContext?.view?.type === "schema" ? <SchemaViewer /> : <></>}
      {sidebarContext?.view?.type === "info" ? <Info /> : <></>}
      {sidebarContext?.view?.type === "config" ? <Config /> : <></>}
      {sidebarContext?.view?.type === "login" ? <Login /> : <></>}
    </div>
  );
}
