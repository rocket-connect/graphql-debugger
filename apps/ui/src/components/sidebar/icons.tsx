import { useCallback, useContext } from "react";

import { SideBarContext, SideBarViewTypes } from "../../context/sidebar";
import { History, HistoryActive as HistoryFilled } from "../../icons/history";
import { InfoFilled, InfoStroke } from "../../icons/info";
import {
  configFilled,
  configStroke,
  folderFilled,
  folderStroke,
  githubDark,
  loginFilled,
  loginStroke,
  npmDark,
} from "../../images";

export function SideBarIcons() {
  const sidebar = useContext(SideBarContext);

  const handleRouteChange = (type: SideBarViewTypes) => {
    if (sidebar) {
      if (sidebar.view?.type === type && sidebar.isOpened) {
        sidebar.close();
        return;
      }
      sidebar.setView({
        type,
      });
      sidebar?.open();
    }
  };

  const activeRoute = (iconType: SideBarViewTypes): boolean | undefined => {
    return sidebar?.view?.type === iconType && sidebar.isOpened;
  };

  return (
    <div className="flex flex-col items-center gap-8 border-r-2 border-neutral-100/15 p-4 h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-5 mx-auto w-8">
          <button onClick={() => handleRouteChange("schema")}>
            {activeRoute("schema") ? (
              <img className="w-8" src={folderFilled} />
            ) : (
              <img className="w-8" src={folderStroke} />
            )}
          </button>

          <button className="w-8" onClick={() => handleRouteChange("config")}>
            {activeRoute("config") ? (
              <img className="w-8" src={configFilled} />
            ) : (
              <img className="w-8" src={configStroke} />
            )}
          </button>
          <button className="w-8" onClick={() => handleRouteChange("login")}>
            {activeRoute("login") ? (
              <img className="w-8" src={loginFilled} />
            ) : (
              <img className="w-8" src={loginStroke} />
            )}
          </button>
          <button className="w-8" onClick={() => handleRouteChange("history")}>
            {activeRoute("history") ? <HistoryFilled /> : <History />}
          </button>
        </div>
        <div className="flex flex-col gap-5 mx-auto">
          <a
            href="https://www.npmjs.com/search?q=graphql-debugger"
            className="flex items-center"
          >
            <span className="w-8">
              <img src={npmDark} alt="npm" />
            </span>
          </a>
          <a
            href="https://github.com/rocket-connect/graphql-debugger"
            className="flex items-center"
          >
            <span className="w-8">
              <img src={githubDark} alt="github" />
            </span>
          </a>

          <button className="w-8" onClick={() => handleRouteChange("info")}>
            {activeRoute("info") ? <InfoFilled /> : <InfoStroke />}
          </button>
        </div>
      </div>
    </div>
  );
}
