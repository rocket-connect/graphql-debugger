import React, { useEffect, useRef } from "react";

import { useModal } from "../../context/ModalContext";

export const Modal: React.FC = () => {
  const { isModalOpen, closeModal, modalContent } = useModal(); // Destructure values and methods from the context
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="modal-bg absolute inset-0 bg-black opacity-80"></div>
      <div
        ref={modalRef}
        className="modal-content bg-white p-6 rounded-md z-10"
      >
        {modalContent}
      </div>
    </div>
  );
};
