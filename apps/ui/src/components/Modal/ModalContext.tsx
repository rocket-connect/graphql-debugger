import { ReactNode, createContext, useState } from "react";

import { ModalContextProps } from "./types";

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined,
);

export const Modal = ({ children }: { children: ReactNode }): JSX.Element => {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
};
