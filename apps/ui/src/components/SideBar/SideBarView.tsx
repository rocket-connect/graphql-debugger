import { useContext } from "react";

import { SideBarContext } from "../../context/sidebar";
import { SchemaViewer } from "../Schema";
import { Info } from "../info/Info";

export function SideBarView() {
  const sidebarContext = useContext(SideBarContext);

  if (!sidebarContext?.isOpened) return <></>;

  return (
    <div className="h-screen flex flex-col items-start w-1/3 max-w-1/3 p-5 text-neutral-100 overflow-scroll">
      {sidebarContext?.view?.type === "schema" ? <SchemaViewer /> : <></>}
      {sidebarContext?.view?.type === "info" ? <Info /> : <></>}
    </div>
  );
}
