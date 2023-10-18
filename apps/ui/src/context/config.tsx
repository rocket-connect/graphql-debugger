import { ReactNode, createContext, useCallback, useState } from "react";

export interface ConfigContextProps {
  backendURL: string;
  setBackendURL: (backendURL: string) => void;
  handleEnableRoute: (type: string) => void;
  handleDisableRoute: (type: string) => void;
  disabledRoutes: string[];
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
  const [disabledRoutes, setDisabledRoutes] = useState<string[]>([
    localStorage.getItem("history") ?? "",
    localStorage.getItem("cookies") ?? "",
  ]);

  const handleEnableRoute = (type: string) => {
    localStorage.setItem(type, type);
    setDisabledRoutes([...disabledRoutes, type]);
  };

  const handleDisableRoute = (type: string) => {
    localStorage.removeItem(type);
    setDisabledRoutes(disabledRoutes.filter((route) => route !== type));
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
        disabledRoutes: disabledRoutes,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
