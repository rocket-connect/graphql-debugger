import { useContext } from "react";

import { SchemasContext } from "../../context/schemas";
import { SideBarContext } from "../../context/sidebar";
import { SchemaViewer } from "../schema/viewer";
import { Config } from "./views/config";
import { History } from "./views/history";
import { Info } from "./views/info/info";
import { InfoLogo } from "./views/info/info-logo";
import { Login } from "./views/login";

interface SideBar {
  description: string;
  component: JSX.Element;
}

export function SideBarView() {
  const sidebarContext = useContext(SideBarContext);
  const schemasContext = useContext(SchemasContext);

  if (!sidebarContext?.isOpened) {
    return <></>;
  }

  const viewType = sidebarContext?.view?.type || "";

  const shouldDisplayLogo = ["login", "info"].includes(viewType);
  const shouldDisplayHeader = !["info"].includes(viewType);

  const sideBarComponentMapper: Record<string, SideBar> = {
    schema: {
      description: schemasContext?.schemaRef.current
        ? "Your GraphQL Schema, with analytics and traces"
        : "Select a GraphQL Schema to start exploring your traces",
      component: <SchemaViewer />,
    },
    info: {
      description: "",
      component: <Info />,
    },
    config: {
      description:
        "Configure GraphQL debugger settings, stored in your browser",
      component: <Config />,
    },
    login: {
      description:
        "Access GraphQL Debugger Cloud to view your projects and collaborate with your team",
      component: <Login />,
    },
    history: {
      description: "View your most recent traces",
      component: <History />,
    },
  };

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
        <div className="flex flex-col gap-2">
          <h2 className="font-bold first-letter:uppercase">
            {sidebarContext.view?.type || ""}
          </h2>
          <p className="text-sm">
            {sideBarComponentMapper[viewType].description}.
          </p>
        </div>
      ) : (
        <></>
      )}
      {sideBarComponentMapper[viewType].component}
    </div>
  );
}
