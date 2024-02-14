import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Home } from "./components/home";
import { ClientProvider } from "./context/client";
import { ConfigProvider } from "./context/config";
import { SchemasProvider } from "./context/schemas";
import { useTheme } from "./hooks/useTheme";

export function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 100_000,
        networkMode: "offlineFirst",
      },
    },
  });
  useTheme();

  return (
    <div>
      <ConfigProvider>
        <ClientProvider>
          <QueryClientProvider client={queryClient}>
            <SchemasProvider>
              <Home />
            </SchemasProvider>
          </QueryClientProvider>
        </ClientProvider>
      </ConfigProvider>
    </div>
  );
}
