import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { client } from "../client";
import { SchemaViewer, SideBar, Trace } from "../components";
import { Modal } from "../components/utils/Modal";
import { Spinner } from "../components/utils/Spinner";
import { useModal } from "../context/ModalContext";
import { DEFAULT_SLEEP_TIME, sleep } from "../utils/sleep";

export const Schema = () => {
  const { isModalOpen } = useModal();
  const navigate = useNavigate();
  const [displaySchema, setDisplaySchema] = useState(true);
  const params = useParams();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["singleSchema"],
    queryFn: async () => {
      const schemas = await client.schema.findMany({
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
