import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { ClientProvider } from "./context/client";
import { ConfigProvider } from "./context/config";
import { SchemasProvider } from "./context/schemas";
import { SideBar } from "./context/sidebar";
import { useTheme } from "./hooks/useTheme";
import { Router } from "./pages/router";

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
              <SideBar>
                <Router />
              </SideBar>
            </SchemasProvider>
          </QueryClientProvider>
        </ClientProvider>
      </ConfigProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="toaster-wrapper"
        toastOptions={{
          className: `text-neutral bg-primary-background`,
          duration: 5000,
        }}
      />
    </div>
  );
}
