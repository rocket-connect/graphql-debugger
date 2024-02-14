import { useContext, useEffect } from "react";

import { SchemasContext } from "../context/schemas";
import { Trace } from "./trace";

export function Home() {
  const schemaId = localStorage.getItem("SCHEMA_ID");
  const schemaContext = useContext(SchemasContext);

  useEffect(() => {
    if (!schemaContext) {
      return;
    }

    if (schemaId) {
      const schema = schemaContext.schemas.find(
        (schema) => schema.id === schemaId,
      );
      if (schema) {
        schemaContext.setSelectedSchema(schema);
      }
    }
  }, [schemaContext, schemaId]);

  return (
    <div
      role="main"
      className="h-screen w-full flex items-center gap-8 py-4 overflow-hidden text-neutral bg-primary-background"
    >
      <div className="flex flex-col gap-4 bg-secondary-background p-5 rounded-2xl w-full h-full mx-4 shadow">
        <Trace schemaId={schemaId as string} />
      </div>
    </div>
  );
}
