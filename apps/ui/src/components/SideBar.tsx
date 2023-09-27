import { Docs, DocsActive, History } from "../icons";
import { SideBarProps } from "./types";

export const SideBar = ({
  handleToggleSchema,
  displaySchema,
}: SideBarProps) => {
  return (
    <div className="flex flex-col items-center gap-8 border-r-2 border-neutral-100/15 p-4 h-screen">
      <button
        onClick={() => {
          handleToggleSchema();
        }}
      >
        {displaySchema ? <DocsActive size={24} /> : <Docs size={24} />}
      </button>
      <History size={24} />
    </div>
  );
};
