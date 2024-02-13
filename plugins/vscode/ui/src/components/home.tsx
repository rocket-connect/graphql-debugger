import { useContext, useEffect } from "react";

import { SchemasContext } from "../context/schemas";

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
    <div>
      <p>{schemaId}</p>
      <p>{schemaContext?.schemas[0]?.id}</p>
    </div>
  );
}
