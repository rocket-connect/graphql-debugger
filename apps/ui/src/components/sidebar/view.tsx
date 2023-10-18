import { useContext } from "react";

import { SchemasContext } from "../../context/schemas";
import { SideBarContext } from "../../context/sidebar";
import { sideBarComponentMapper } from "./utils";
import { InfoLogo } from "./views/info/info-logo";

export function SideBarView() {
  const sidebarContext = useContext(SideBarContext);
  const schemasContext = useContext(SchemasContext);

  if (!sidebarContext?.isOpened) {
    return <></>;
  }

  const viewType = sidebarContext?.view?.type || "";

  const shouldDisplayLogo = ["login", "info"].includes(viewType);
  const shouldDisplayHeader = !["info"].includes(viewType);

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
            {
              sideBarComponentMapper(
                Number(schemasContext?.schemaRef.current?.hash.length) > 0,
              )[viewType].description
            }
            .
          </p>
        </div>
      ) : (
        <></>
      )}
      {sideBarComponentMapper()[viewType].component}
    </div>
  );
}
