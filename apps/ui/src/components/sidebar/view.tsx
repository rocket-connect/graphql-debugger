import { useContext } from "react";

import { SideBarContext } from "../../context/sidebar";
import { Config } from "../config/config";
import { Info } from "../info/info";
import { Login } from "../login/login";
import { SchemaViewer } from "../schema/viewer";

export function SideBarView() {
  const sidebarContext = useContext(SideBarContext);

  if (!sidebarContext?.isOpened) return <></>;

  return (
    <div className="h-screen flex flex-col items-start w-2/6 max-w-2/6 p-5 text-neutral-100 overflow-scroll custom-scrollbar">
      {sidebarContext?.view?.type === "schema" ? <SchemaViewer /> : <></>}
      {sidebarContext?.view?.type === "info" ? <Info /> : <></>}
      {sidebarContext?.view?.type === "config" ? <Config /> : <></>}
      {sidebarContext?.view?.type === "login" ? <Login /> : <></>}
    </div>
  );
}
