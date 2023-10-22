import { useContext } from "react";

import { ConfigContext } from "../../context/config";
import { SideBarContext, type SideBarViewTypes } from "../../context/sidebar";
import { InfoFilled, InfoStroke } from "../../icons/info";
import { githubDark, npmDark } from "../../images";
import { iconsMapper } from "./utils";
import { SideBarView } from "./view";

export function SideBarIcons() {
  const sidebar = useContext(SideBarContext);
  const config = useContext(ConfigContext);

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
    <div className="flex flex-col items-center gap-8 border-r-2 border-neutral-100/15 p-4 h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-5 mx-auto w-8">
          {Object.values(iconsMapper(config?.routes)).map((icon) => {
            if (icon.hidden) return null;
            return (
              <button
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
