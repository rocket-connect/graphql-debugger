import { DebuggerClient } from "@graphql-debugger/client";

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { sleep } from "../utils/sleep";
import { ConfigContext } from "./config";

export interface ClientContextProps {
  client: DebuggerClient;
  isConnected?: boolean;
  isFetching?: boolean;
}

export const ClientContext = createContext<ClientContextProps>({
  client: new DebuggerClient(),
  isConnected: false,
  isFetching: true,
});

export function ClientProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const configContext = useContext(ConfigContext);
  const [isConnected, setIsConnected] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const [client, setClient] = useState(
    new DebuggerClient({
      backendUrl: configContext?.backendURL,
    }),
  );

  useEffect(() => {
    setClient(
      new DebuggerClient({
        backendUrl: configContext?.backendURL,
      }),
    );
  }, [setClient, configContext?.backendURL]);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsFetching(true);
        await client?.ping();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      } finally {
        await sleep(2000);
        setIsFetching(false);
      }
    };

    (async () => {
      await checkConnection();
    })();

    const interval = setInterval(() => {
      (async () => {
        await checkConnection();
      })();
    }, 5000);

    return () => clearInterval(interval);
  }, [client, setIsConnected, setIsFetching]);

  return (
    <ClientContext.Provider
      value={{
        client,
        isConnected,
        isFetching,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
