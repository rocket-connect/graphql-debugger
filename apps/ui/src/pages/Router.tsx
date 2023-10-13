import { HashRouter, Route, Routes } from "react-router-dom";

import { Dashboard } from "./Dashboard";
import { Schema } from "./Schema";

export function Router() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Dashboard />} />
        <Route path="/schema/:schemaId" element={<Schema />} />
        <Route path="/schema/:schemaId/trace/:traceId" element={<Schema />} />
      </Routes>
    </HashRouter>
  );
}
