import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Trace } from "../components/trace/trace";
import { Page } from "../components/utils/Page";
import { SchemasContext } from "../context/schemas";

export function Schema() {
  const params = useParams();
  const schemaContext = useContext(SchemasContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!schemaContext) {
      return;
    }

    if (params.schemaId) {
      const schema = schemaContext.schemas.find(
        (schema) => schema.id === params.schemaId,
      );
      if (schema) {
        schemaContext.setSelectedSchema(schema);
      }
    }
  }, [schemaContext, navigate, params.schemaId]);

  return (
    <Page>
      <Trace />
    </Page>
  );
}
