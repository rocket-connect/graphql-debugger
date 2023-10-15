import { Schema } from "@graphql-debugger/types";

import { createContext, useCallback, useState } from "react";

import { SideBarIcons } from "../components/sidebar/icons";

export type SideBarViewTypes = "schema" | "info" | "config" | "login";

export type SideBarSchemaView = {
  type: "schema";
  data?: {
    schema?: Schema;
  };
};

export type SideBarInfoView = {
  type: "info";
};

export type SideBarConfigView = {
  type: "config";
};

export type SideBarLoginView = {
  type: "login";
};

export type SideBarView = (
  | SideBarSchemaView
  | SideBarInfoView
  | SideBarConfigView
  | SideBarLoginView
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
