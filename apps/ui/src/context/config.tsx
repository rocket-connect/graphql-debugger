import { ReactNode, createContext, useCallback, useState } from "react";

export interface ConfigContextProps {
  backendURL: string;
  setBackendURL: (backendURL: string) => void;
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
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
