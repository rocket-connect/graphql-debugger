import { ReactElement, cloneElement, useContext } from "react";

import { ModalContext } from "../../context/modal";

export interface OpenModalProps {
  children: ReactElement;
  opens: string;
}

export function OpenModal({
  children,
  opens: modalName,
}: OpenModalProps): JSX.Element {
  const context = useContext(ModalContext);

  return cloneElement(children, { onClick: () => context?.open(modalName) });
}
