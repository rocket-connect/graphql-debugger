import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { listSchemas } from "../../src/api/list-schemas";
import { SchemaViewer, SideBar, Trace } from "../components";
import { Spinner } from "../components/utils/Spinner";
import { useModal } from "../context/ModalContext";
import { DEFAULT_SLEEP_TIME, sleep } from "../utils/sleep";

const Modal: React.FC = () => {
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

export default Modal;

export const Schema = () => {
  const { isModalOpen } = useModal();
  const navigate = useNavigate();
  const [displaySchema, setDisplaySchema] = useState(true);
  const params = useParams();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["singleSchema"],
    queryFn: async () => {
      const schemas = await listSchemas({
        where: {
          id: params.schemaId,
        },
      });

      await sleep(DEFAULT_SLEEP_TIME);

      return schemas;
    },
    select: (data) => {
      return data.find(({ id }) => id === params.schemaId);
    },
    networkMode: "always",
  });

  const handleToggleSchema = () => setDisplaySchema((value) => !value);

  useEffect(() => {
    if (!isLoading) {
      if (!schema) {
        navigate("/schemas");
      }
    }
  }, [isLoading, schema, navigate]);

  return (
    <div className="h-screen flex-shrink-0 flex items-center gap-8 py-4 bg-white-100 overflow-hidden">
      <SideBar
        handleToggleSchema={handleToggleSchema}
        displaySchema={displaySchema}
      />
      {isLoading ? (
        <div className="flex justify-center align-center w-3/6 mx-auto">
          <Spinner size={"10"} />
        </div>
      ) : (
        <>
          {displaySchema && schema && (
            <SchemaViewer typeDefs={schema?.typeDefs} schemaId={schema?.id} />
          )}
          <Trace />
        </>
      )}
      {isModalOpen && <Modal />}
    </div>
  );
};
