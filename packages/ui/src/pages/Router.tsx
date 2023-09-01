import { HashRouter, Route, Routes } from 'react-router-dom';
import { Schemas } from './Schemas';
import { Schema } from './Schema';

export function Router(props: React.PropsWithChildren<{}>) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Schemas />} />
        <Route path="/schema/:schemaId" element={<Schema />} />
        <Route path="/schema/:schemaId/trace/:traceId" element={<Schema />} />
      </Routes>
    </HashRouter>
  );
}
