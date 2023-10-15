import { useCallback, useContext } from "react";

import { SideBarContext } from "../../context/sidebar";
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

  const handleToggleSchema = useCallback(() => {
    if (sidebar) {
      if (sidebar.view?.type === "schema" && sidebar.isOpened) {
        sidebar.close();
        return;
      }

      sidebar.setView({
        type: "schema",
      });
      sidebar.open();
    }
  }, [sidebar]);

  const handleToggleInfo = useCallback(() => {
    if (sidebar) {
      if (sidebar.view?.type === "info" && sidebar.isOpened) {
        sidebar.close();
        return;
      }

      sidebar.setView({
        type: "info",
      });
      sidebar.open();
    }
  }, [sidebar]);

  const handleToggleConfig = useCallback(() => {
    if (sidebar) {
      if (sidebar.view?.type === "config" && sidebar.isOpened) {
        sidebar.close();
        return;
      }

      sidebar.setView({
        type: "config",
      });
      sidebar.open();
    }
  }, [sidebar]);

  const handleToggleLogin = useCallback(() => {
    if (sidebar) {
      if (sidebar.view?.type === "login" && sidebar.isOpened) {
        sidebar.close();
        return;
      }

      sidebar.setView({
        type: "login",
      });
      sidebar.open();
    }
  }, [sidebar]);

  const isSchemaActive = sidebar?.view?.type === "schema" && sidebar.isOpened;
  const isInfoActive = sidebar?.view?.type === "info" && sidebar.isOpened;
  const isConfigActive = sidebar?.view?.type === "config" && sidebar.isOpened;
  const isLoginActive = sidebar?.view?.type === "login" && sidebar.isOpened;

  return (
    <div className="flex flex-col items-center gap-8 border-r-2 border-neutral-100/15 p-4 h-screen">
      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-5 mx-auto w-8">
          <button onClick={handleToggleSchema}>
            {isSchemaActive ? (
              <img className="w-8" src={folderFilled} />
            ) : (
              <img className="w-8" src={folderStroke} />
            )}
          </button>

          <button className="w-8" onClick={handleToggleConfig}>
            {isConfigActive ? (
              <img className="w-8" src={configFilled} />
            ) : (
              <img className="w-8" src={configStroke} />
            )}
          </button>
          <button className="w-8" onClick={handleToggleLogin}>
            {isLoginActive ? (
              <img className="w-8" src={loginFilled} />
            ) : (
              <img className="w-8" src={loginStroke} />
            )}
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

          <button className="w-8" onClick={handleToggleInfo}>
            {isInfoActive ? <InfoFilled /> : <InfoStroke />}
          </button>
        </div>
      </div>
    </div>
  );
}
