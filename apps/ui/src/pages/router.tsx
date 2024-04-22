import { HashRouter, Route, Routes } from "react-router-dom";

import { Dashboard } from "./dashboard";
import { Demo } from "./demo/demo";
import { Schema } from "./schema";

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Dashboard />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/schema/:schemaId" element={<Schema />} />
        <Route path="/schema/:schemaId/trace/:traceId" element={<Schema />} />
      </Routes>
    </HashRouter>
  );
}
