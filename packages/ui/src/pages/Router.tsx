import { HashRouter, Route, Routes } from 'react-router-dom';
import { Home } from './Home';
import { Schemas } from './Schemas';
import { Schema } from './Schema';

export function Router(props: React.PropsWithChildren<{}>) {
  return (
    <HashRouter>
      <div className="flex flex-row">
        {props.children}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schemas" element={<Schemas />} />
          <Route path="/schema/:schemaId" element={<Schema />} />
          <Route path="/schema/:schemaId/trace/:traceId" element={<Schema />} />
        </Routes>
      </div>
    </HashRouter>
  );
}
