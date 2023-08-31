import { SideBar } from './components/SideBar';
import { Router } from './pages/Router';

export function App() {
  return (
    <div className="bg-graphiql-dark flex h-screen">
      <Router>
        <SideBar />
      </Router>
    </div>
  );
}
