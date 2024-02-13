import { ReactNode, createContext, useState } from "react";

export interface ConfigContextProps {
  apiURL: string;
}

export const ConfigContext = createContext<ConfigContextProps | undefined>(
  undefined,
);

export function ConfigProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [apiURL] = useState(
    localStorage.getItem("apiURL") || "http://localhost:16686",
  );

  return (
    <ConfigContext.Provider
      value={{
        apiURL: apiURL,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
