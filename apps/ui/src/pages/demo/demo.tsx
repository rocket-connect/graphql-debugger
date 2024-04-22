import { useContext, useEffect } from "react";

import { InfoLogo } from "../../components/sidebar/views/info/info-logo";
import { Page } from "../../components/utils/page";
import { SchemasContext } from "../../context/schemas";
import { IDS } from "../../testing";
import { demoSchema } from "./schema";

export function Demo() {
  const schemaContext = useContext(SchemasContext);

  useEffect(() => {
    if (!schemaContext) {
      return;
    }
    schemaContext.setSelectedSchema(demoSchema);
  });

  return (
    <Page id={IDS.demo.page}>
      <div className="rounded-2xl py-10 px-28 mx-auto my-auto shadow bg-primary-background">
        <InfoLogo id={IDS.dashboard.logo} />
      </div>
    </Page>
  );
}
