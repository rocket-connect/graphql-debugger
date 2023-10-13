import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { InfoLogo } from "../components/info/InfoLogo";
import { Page } from "../components/utils/Page";
import { SchemasContext } from "../context/schemas";

export function Dashboard() {
  const schemaContext = useContext(SchemasContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!schemaContext) {
      return;
    }

    if (schemaContext.isLoading) {
      return;
    }
  }, [schemaContext, navigate]);

  return (
    <Page>
      <div className="rounded-2xl py-10 px-28 mx-auto my-auto shadow bg-white">
        <InfoLogo />
      </div>
    </Page>
  );
}
