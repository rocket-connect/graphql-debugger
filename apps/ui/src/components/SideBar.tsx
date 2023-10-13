import { Docs, DocsActive, History } from "../icons";
import { githubDark, npmDark } from "../images";
import { SideBarProps } from "./types";

export const SideBar = ({
  handleToggleSchema,
  isSchemaActive,
  isDashboard,
}: SideBarProps) => {
  return (
    <div className="flex flex-col items-center gap-8 border-r-2 border-neutral-100/15 p-4 h-screen">
      <div className="flex flex-col justify-between h-full">
        <button className="mx-auto" onClick={() => handleToggleSchema?.()}>
          {isSchemaActive || isDashboard ? (
            <DocsActive size={30} />
          ) : (
            <Docs size={30} />
          )}
        </button>
        {isDashboard ? (
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
          </div>
        ) : (
          <History size={24} />
        )}
      </div>
    </div>
  );
};
