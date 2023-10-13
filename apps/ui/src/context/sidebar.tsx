import { Schema } from "@graphql-debugger/types";

import { createContext, useCallback, useState } from "react";

import { SideBarIcons } from "../components/sidebar/icons";

export type SideBarViewTypes = "schema" | "no-schema" | "schema-list" | "info";

export type SideBarSchemaView = {
  type: "schema";
  data?: {
    schema?: Schema;
  };
};

export type SideBarNoSchemaView = {
  type: "no-schema";
};

export type SideBarSchemaListView = {
  type: "schema-list";
  data?: { schemas?: Schema[] };
};

export type SideBarInfoView = {
  type: "info";
};

export type SideBarView = (
  | SideBarSchemaView
  | SideBarNoSchemaView
  | SideBarSchemaListView
  | SideBarInfoView
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

export function SideBar({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [view, setSideBarView] = useState<SideBarView | undefined>({
    type: "schema",
  });
  const [isOpened, setIsOpened] = useState(true);

  const close = useCallback(() => {
    setIsOpened(false);
  }, [setIsOpened]);

  const open = useCallback(() => {
    setIsOpened(true);
  }, [setIsOpened]);

  const setView = useCallback(
    (v: SideBarView) => {
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
