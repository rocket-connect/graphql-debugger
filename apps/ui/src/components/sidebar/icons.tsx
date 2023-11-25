import { useContext } from "react";

import { SideBarContext, type SideBarViewTypes } from "../../context/sidebar";
import { GithubIcon } from "../../icons";
import { Info, InfoFilled } from "../../icons/info";
import { IDS } from "../../testing";
import { iconsMapper } from "./utils";

export function SideBarIcons() {
  const sidebar = useContext(SideBarContext);

  const handleRouteChange = (type: string) => {
    if (sidebar) {
      if (sidebar.view?.type === type && sidebar.isOpened) {
        sidebar.close();
        return;
      }
      sidebar.setView({
        type: type as SideBarViewTypes,
      });
      sidebar?.open();
    }
  };

  const activeRoute = (iconType: string): boolean | undefined => {
    return sidebar?.view?.type === iconType && sidebar.isOpened;
  };

  return (
    <div
      id={IDS.sidebar.icons.view}
      className="flex flex-col items-center gap-8  p-4 h-screen bg-primary-background"
    >
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-5 mx-auto w-8">
          {Object.values(iconsMapper).map((icon) => {
            return (
              <button
                id={icon.id}
                className="w-8"
                key={icon.type}
                onClick={() => handleRouteChange(icon.type)}
              >
                {activeRoute(icon.type) ? icon.active : icon.inactive}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-5 mx-auto">
          <a
            id={IDS.sidebar.icons.github}
            href="https://github.com/rocket-connect/graphql-debugger"
            className="flex items-center"
          >
            <GithubIcon />
          </a>

          <button
            id={IDS.sidebar.icons.info}
            className="w-8"
            onClick={() => handleRouteChange("info")}
          >
            {activeRoute("info") ? <InfoFilled /> : <Info />}
          </button>
        </div>
      </div>
    </div>
  );
}
