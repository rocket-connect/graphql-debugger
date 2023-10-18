import { ReactNode, createContext, useCallback, useState } from "react";

export interface ConfigContextProps {
  backendURL: string;
  setBackendURL: (backendURL: string) => void;
  handleEnableRoute: (type: string) => void;
  handleDisableRoute: (type: string) => void;
  routes: string[];
}

export const ConfigContext = createContext<ConfigContextProps | undefined>(
  undefined,
);

export function ConfigProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [backendURL, setBackendURL] = useState(
    localStorage.getItem("backendURL") || "http://localhost:16686",
  );
  const [routes, setRoutes] = useState<string[]>(
    JSON.parse(localStorage.getItem("routes") || "[]"),
  );

  const handleEnableRoute = (type: string) => {
    localStorage.setItem("routes", JSON.stringify([...routes, type]));
    setRoutes([...routes, type]);
  };

  const handleDisableRoute = (type: string) => {
    localStorage.setItem(
      "routes",
      JSON.stringify(routes.filter((route) => route !== type)),
    );
    setRoutes(routes.filter((route) => route !== type));
  };

  const handleSetBackendURL = useCallback(
    (backendURL: string) => {
      localStorage.setItem("backendURL", backendURL);
      setBackendURL(backendURL);
    },
    [setBackendURL],
  );

  return (
    <ConfigContext.Provider
      value={{
        backendURL: backendURL,
        setBackendURL: handleSetBackendURL,
        handleEnableRoute: handleEnableRoute,
        handleDisableRoute: handleDisableRoute,
        routes: routes,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
