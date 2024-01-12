import { ReactNode, createContext, useState } from "react";

export interface ConfigContextProps {
  apiURL: string;
  setapiURL: (apiURL: string) => void;
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
  const [apiURL, setapiURL] = useState(
    localStorage.getItem("apiURL") || "http://localhost:16686",
  );
  const [routes, setRoutes] = useState<string[]>(
    JSON.parse(localStorage.getItem("routes") || "[]"),
  );

  const handleEnableRoute = (type: string) => {
    localStorage.setItem("routes", JSON.stringify([...routes, type]));
    setRoutes((previousRoutes) => [...previousRoutes, type]);
  };

  const handleDisableRoute = (type: string) => {
    localStorage.setItem(
      "routes",
      JSON.stringify(routes.filter((route) => route !== type)),
    );
    setRoutes((previousRoutes) => {
      return previousRoutes.filter((route) => route !== type);
    });
  };

  const handleSetapiURL = (apiURL: string) => {
    localStorage.setItem("apiURL", apiURL);
    setapiURL(apiURL);
  };

  return (
    <ConfigContext.Provider
      value={{
        apiURL: apiURL,
        setapiURL: handleSetapiURL,
        handleEnableRoute: handleEnableRoute,
        handleDisableRoute: handleDisableRoute,
        routes: routes,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
