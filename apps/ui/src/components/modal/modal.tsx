import { useEffect } from "react";
import { createPortal } from "react-dom";

import { cn } from "../../utils/cn";

type ModalType = "full-screen" | "small" | "default";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string | React.ReactNode;
  type: ModalType;
}

export function Modal({
  open,
  onClose,
  children,
  type,
  title = "Modal title",
}: ModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", closeOnEscape);

    return () => window.removeEventListener("keydown", closeOnEscape);
  });

  if (!open) return null;

  return createPortal(
    <div
      id="modal"
      onClick={onClose}
      className="fixed top-0 left-0 w-full h-screen bg-black/50 backdrop-filter backdrop-blur-sm z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "p-6 shadow-sm fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-text-primary rounded-xl bg-secondary-background transition-all",
          {
            "w-11/12 h-5/6": type === "full-screen",
            "w-1/2 h-1/2": type === "small",
          },
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-primary"
        >
          X
        </button>
        <h2 className="text-bold text-xl text-text-primary mb-3">{title}</h2>
        <div className="custom-scrollbar max-h-[92%] overflow-scroll">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
