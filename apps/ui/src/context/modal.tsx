import { ReactNode, createContext, useState } from "react";

export interface ModalContextProps {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

export const ModalContext = createContext<ModalContextProps | undefined>(
  undefined,
);

export function Modal({ children }: { children: ReactNode }): JSX.Element {
  const [openName, setOpenName] = useState("");
  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}
