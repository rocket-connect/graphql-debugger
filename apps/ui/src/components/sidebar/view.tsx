import { useContext } from "react";

import { SchemasContext } from "../../context/schemas";
import { SideBarContext } from "../../context/sidebar";
import { IDS } from "../../testing";
import { sideBarComponentMapper } from "./utils";
import { InfoLogo } from "./views/info/info-logo";

export function SideBarView() {
  const sidebarContext = useContext(SideBarContext);
  const schemasContext = useContext(SchemasContext);

  const viewType = sidebarContext?.view?.type || "";

  const isSchemaSelected =
    Number(schemasContext?.schemaRef.current?.hash.length) > 0;

  const sideBarViewComponent =
    sideBarComponentMapper(isSchemaSelected)[viewType].component;

  const sideBarViewDescription =
    sideBarComponentMapper(isSchemaSelected)[viewType].description;

  if (!sidebarContext?.isOpened) {
    return <></>;
  }

  const shouldDisplayLogo = ["info"].includes(viewType);
  const shouldDisplayHeader = !["info"].includes(viewType);

  return (
    <div
      id={IDS.sidebar.view}
      className="h-screen border-l-2 border-l-accent flex flex-col items-start w-2/6 max-w-2/6 p-5 text-neutral overflow-scroll gap-5 custom-scrollbar"
    >
      {shouldDisplayLogo ? (
        <div className="mx-auto">
          <InfoLogo id={IDS.sidebar.logo} />
        </div>
      ) : (
        <></>
      )}
      {shouldDisplayHeader ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold first-letter:uppercase">
            {sidebarContext.view?.type || ""}
          </h2>
          <p className="text-sm">{sideBarViewDescription}.</p>
        </div>
      ) : (
        <></>
      )}
      {sideBarViewComponent}
    </div>
  );
}
