import { createContext, useState } from "react";

import { SideBarIcons } from "./SideBarIcons";
import { SideBarProps, type SideBarView as TSideBarView } from "./types";

export const SideBarContext = createContext<SideBarProps | undefined>(
  undefined,
);

export function SideBar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [view, setSideBarView] = useState<TSideBarView | undefined>();

  const close = () => setSideBarView(undefined);

  return (
    <SideBarContext.Provider
      value={{ close, open: (v: TSideBarView) => setSideBarView(v), view }}
    >
      <div className="flex">
        <SideBarIcons />
        {children}
      </div>
    </SideBarContext.Provider>
  );
}
