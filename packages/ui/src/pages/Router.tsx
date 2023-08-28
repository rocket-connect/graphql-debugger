import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Home } from './Home';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
