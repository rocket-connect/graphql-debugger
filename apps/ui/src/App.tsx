import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SideBar } from "./components/SideBar/SideBarContext";
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
        <SideBar>
          <Router />
        </SideBar>
      </QueryClientProvider>
    </div>
  );
};
