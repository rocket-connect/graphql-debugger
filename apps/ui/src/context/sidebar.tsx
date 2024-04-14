import { Schema } from "@graphql-debugger/types";

import { createContext, useCallback, useState } from "react";

import { SideBarIcons } from "../components/sidebar/icons";

export type SideBarViewTypes =
  | "schema"
  | "info"
  | "config"
  | "history"
  | "favourites";

export type SideBarSchemaView = {
  type: "schema";
  data?: {
    schema?: Schema;
  };
};

export type SideBarInfoView = {
  type: "info";
};

export type SideBarFavouritesView = {
  type: "favourites";
};

export type SideBarConfigView = {
  type: "config";
};

export type SideBarHistoryView = {
  type: "history";
};

export type SideBarView = (
  | SideBarSchemaView
  | SideBarInfoView
  | SideBarConfigView
  | SideBarHistoryView
  | SideBarFavouritesView
) & {
  isLoading?: boolean;
};

export interface SideBarProps {
  view?: SideBarView;
  isOpened?: boolean;
  close: () => void;
  open: () => void;
  setView: (view: SideBarView) => void;
}

export const SideBarContext = createContext<SideBarProps | undefined>(
  undefined,
);

const localStorageViewKey = "graphql-debugger-sidebar-view";
const localStorageOpenKey = "graphql-debugger-sidebar-isOpen";

export function SideBar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [view, setSideBarView] = useState<SideBarView | undefined>({
    type:
      (localStorage.getItem(
        localStorageViewKey,
      ) as unknown as SideBarViewTypes) || "schema",
  });
  const [isOpened, setIsOpened] = useState(
    localStorage.getItem(localStorageOpenKey) === "true",
  );

  const close = useCallback(() => {
    localStorage.setItem(localStorageOpenKey, "false");
    setIsOpened(false);
  }, [setIsOpened]);

  const open = useCallback(() => {
    localStorage.setItem(localStorageOpenKey, "true");
    setIsOpened(true);
  }, [setIsOpened]);

  const setView = useCallback(
    (v: SideBarView) => {
      localStorage.setItem(localStorageViewKey, v.type);
      setSideBarView(v);
    },
    [setSideBarView],
  );

  return (
    <SideBarContext.Provider value={{ close, open, view, isOpened, setView }}>
      <div className="flex">
        <SideBarIcons />
        {children}
      </div>
    </SideBarContext.Provider>
  );
}
