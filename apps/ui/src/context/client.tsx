import { DebuggerClient } from "@graphql-debugger/client";
import type { Trace } from "@graphql-debugger/types";

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
  historyTraces: HistoryTrace[];
  favourites: HistoryTrace[];
  handleSetHistoryTraces: (trace: HistoryTrace) => void;
  handleDeleteHistoryTrace: (traceId: string) => void;
  handleSetFavourites: (trace: HistoryTrace) => void;
}

interface HistoryTrace {
  trace: Trace;
  schemaId?: string;
}
export const ClientContext = createContext<ClientContextProps>({
  client: new DebuggerClient(),
  handleSetClient: () => {},
  historyTraces: [],
  favourites: [],
  handleSetHistoryTraces: (trace: HistoryTrace) => {},
  handleDeleteHistoryTrace: (traceId: string) => {},
  handleSetFavourites: (trace: HistoryTrace) => {},
});

export function ClientProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const configContext = useContext(ConfigContext);
  const [historyTraces, setHistoryTraces] = useState<HistoryTrace[]>(
    JSON.parse(localStorage.getItem("traces") || "[]"),
  );
  const [favourites, setFavourites] = useState<HistoryTrace[]>(
    JSON.parse(localStorage.getItem("favourites") || "[]"),
  );

  const [client, setClient] = useState(
    new DebuggerClient({
      backendUrl: configContext?.backendURL,
    }),
  );

  const handleDeleteHistoryTrace = (traceId: string) => {
    const filteredTraces = historyTraces.filter(
      (trace) => trace.trace.id !== traceId,
    );
    localStorage.setItem("traces", JSON.stringify(filteredTraces));
    setHistoryTraces(filteredTraces);
  };

  const handleSetHistoryTraces = (trace: HistoryTrace) => {
    localStorage.setItem("traces", JSON.stringify([...historyTraces, trace]));
    setHistoryTraces((previousTraces) => [...previousTraces, trace]);
  };

  const handleSetFavourites = (trace: HistoryTrace) => {
    localStorage.setItem("favourites", JSON.stringify([...favourites, trace]));
    setFavourites((previousTraces) => [...previousTraces, trace]);
  };

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
        historyTraces,
        handleSetHistoryTraces,
        favourites,
        handleSetFavourites,
        handleDeleteHistoryTrace,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
