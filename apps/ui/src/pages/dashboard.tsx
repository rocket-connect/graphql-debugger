import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { InfoLogo } from "../components/sidebar/views/info/info-logo";
import { Page } from "../components/utils/page";
import { SchemasContext } from "../context/schemas";
import { IDS } from "../testing";

export function Dashboard() {
  const params = useParams();
  const schemaContext = useContext(SchemasContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!schemaContext) {
      return;
    }

    if (schemaContext.isLoading) {
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
    <Page id={IDS.dashboard.page}>
      <div className="rounded-2xl py-10 px-28 mx-auto my-auto shadow bg-primary-background">
        <InfoLogo id={IDS.dashboard.logo} />
      </div>
    </Page>
  );
}
