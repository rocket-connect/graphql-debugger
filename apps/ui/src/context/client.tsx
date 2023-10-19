import { DebuggerClient } from "@graphql-debugger/client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { ConfigContext } from "./config";

export interface ClientContextProps {
  client: DebuggerClient;
  handleSetClient: (url: string) => void;
}

export const ClientContext = createContext<ClientContextProps>({
  client: new DebuggerClient(),
  handleSetClient: () => {},
});

export function ClientProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const configContext = useContext(ConfigContext);

  const [client, setClient] = useState(
    new DebuggerClient({
      backendUrl: configContext?.backendURL,
    }),
  );

  const handleSetClient = (url: string) => {
    setClient(
      new DebuggerClient({
        backendUrl: url,
      }),
    );
  };
  useEffect(() => {
    setClient(
      new DebuggerClient({
        backendUrl: configContext?.backendURL,
      }),
    );
  }, [setClient, configContext?.backendURL]);

  return (
    <ClientContext.Provider
      value={{
        client,
        handleSetClient,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
