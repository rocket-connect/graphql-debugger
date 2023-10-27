import classNames from "classnames";
import { ReactElement, useContext, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { ModalContext } from "../../context/modal";
import { IDS } from "../../testing";

export interface WindowModalProps {
  children: ReactElement;
  name: string;
  type: "full-screen" | "small";
  title: string | JSX.Element;
  id: string;
}

export function ModalWindow({
  children,
  name,
  type,
  title,
  id,
}: WindowModalProps): ReactElement | null {
  const context = useContext(ModalContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        context?.close();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => document.removeEventListener("click", handleClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context?.close]);

  if (name !== context?.openName) return null;

  return createPortal(
    <div className="text-neutral-100">
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50"></div>
      <div
        ref={ref}
        className={classNames(
          "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-100 rounded-lg shadow-lg p-10 transition-all duration-500 overflow-hidden",
          {
            "w-11/12 h-5/6": type === "full-screen",
            "w-1/2 h-1/2": type === "small",
          },
        )}
      >
        <button
          id={IDS.modal.close}
          onClick={context.close}
          className="bg-none border-none p-2 rounded-sm transform translate-x-4 transition-all duration-200 absolute top-3 right-6 hover:bg-gray-200"
        >
          <div className="w-6 h-6 text-gray-500">X</div>
        </button>
        <h2 className="text-bold text-xl mb-3">{title}</h2>
        <div id={id} className="h-full w-full overflow-scroll custom-scrollbar">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
