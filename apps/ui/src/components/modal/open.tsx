import { ReactElement, cloneElement, useContext } from "react";

import { ModalContext } from "../../context/modal";

export interface OpenModalProps {
  children: ReactElement;
  opens: string;
  id: string;
}

export function OpenModal({
  children,
  opens: modalName,
  id,
}: OpenModalProps): JSX.Element {
  const context = useContext(ModalContext);

  return cloneElement(children, {
    id,
    onClick: () => context?.open(modalName),
  });
}
