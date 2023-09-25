import { HashRouter, Route, Routes } from "react-router-dom";

import { Schema } from "./Schema";
import { Schemas } from "./Schemas";

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Schemas />} />
        <Route path="*" element={<Schemas />} />
        <Route path="/schema/:schemaId" element={<Schema />} />
        <Route path="/schema/:schemaId/trace/:traceId" element={<Schema />} />
      </Routes>
    </HashRouter>
  );
}
