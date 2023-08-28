import { Header } from './components/Header';
import { TraceViewer } from './components/TraceViewer';

export function App() {
  return (
    <div className="bg-graphql-otel-dark gradient-background flex flex-col">
      <Header />
      <TraceViewer />
    </div>
  );
}
