import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { listSchemas } from "../../src/api/list-schemas";
import { SchemaViewer, SideBar, Trace } from "../components";
import { Spinner } from "../components/utils/Spinner";

export const Schema = () => {
  const [displaySchema, setDisplaySchema] = useState(true);
  const params = useParams();

  const { data: schema, isLoading } = useQuery({
    queryKey: ["singleSchema"],
    queryFn: async () => await listSchemas(),
    select: (data) => {
      return data.find(({ id }) => id === params.schemaId);
    },
  });

  const handleToggleSchema = () => setDisplaySchema((value) => !value);

  return (
    <div className="h-screen flex-shrink-0 flex items-center gap-8 py-4 bg-white-100 overflow-hidden">
      <SideBar
        handleToggleSchema={handleToggleSchema}
        displaySchema={displaySchema}
      />
      {displaySchema && schema && (
        <SchemaViewer typeDefs={schema?.typeDefs} schemaId={schema?.id} />
      )}
      {isLoading ? (
        <div className="flex justify-center align-center w-3/6 mx-auto">
          <Spinner size={10} />
        </div>
      ) : (
        <Trace />
      )}
    </div>
  );
};
