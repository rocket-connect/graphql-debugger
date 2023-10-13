import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Trace } from "../components/trace/trace";
import { Page } from "../components/utils/Page";
import { SchemasContext } from "../context/schemas";

export function Schema() {
  const schemasContext = useContext(SchemasContext);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!schemasContext) {
      return;
    }

    if (schemasContext.isLoading) {
      return;
    }

    const foundSchema = schemasContext?.schemas.find(
      (s) => s.id === params.schemaId,
    );

    if (!foundSchema) {
      navigate("/");
    } else {
      schemasContext.setSchema(foundSchema);
      navigate(`/schema/${foundSchema.id}`);
    }
  }, [schemasContext, navigate, params]);

  return (
    <Page>
      <Trace />
    </Page>
  );
}
