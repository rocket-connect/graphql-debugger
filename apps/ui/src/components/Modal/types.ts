import { ReactElement, ReactNode } from "react";

export interface ModalContextProps {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

export interface OpenModalProps {
  children: ReactElement;
  opens: string;
}

export interface WindowModalProps {
  children: ReactElement;
  name: string;
  type: "full-screen" | "small";
  title: string;
}
