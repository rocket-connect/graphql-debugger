import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Router } from "./pages/Router";

export const App = () => {
  const queryClient = new QueryClient();
  return (
    <div className="bg-graphiql-dark">
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </div>
  );
};
