import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SchemasProvider } from "./context/schemas";
import { SideBar } from "./context/sidebar";
import { Router } from "./pages/Router";

export const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 100_000,
        networkMode: "offlineFirst",
      },
    },
  });

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <SchemasProvider>
          <SideBar>
            <Router />
          </SideBar>
        </SchemasProvider>
      </QueryClientProvider>
    </div>
  );
};
