import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { listSchemas } from "../../src/api/list-schemas";
import { SideBar } from "../components";
import { Trace } from "../components/Trace";
import { SchemaViewer } from "../components/schema-viewer/SchemaViewer";

export const Schema = () => {
  const [displaySchema, setDisplaySchema] = useState(true);
  const params = useParams();

  const { data: schema } = useQuery({
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
      <Trace schemaId={schema?.id} />
    </div>
  );
};
