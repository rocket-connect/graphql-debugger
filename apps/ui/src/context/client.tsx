import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
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
  handleDeleteHistoryTrace: (uniqueId: string) => void;
  handleDeleteFavouriteTrace: (uniqueId: string) => void;
  handleSetFavourites: (trace: HistoryTrace) => void;
}

export interface HistoryTrace {
  trace: Trace;
  uniqueId: string;
  schemaId: string;
  timestamp: Date;
}

export const ClientContext = createContext<ClientContextProps>({
  client: new DebuggerClient(),
  handleSetClient: () => {},
  historyTraces: [],
  favourites: [],
  handleSetHistoryTraces: () => {},
  handleDeleteHistoryTrace: () => {},
  handleSetFavourites: () => {},
  handleDeleteFavouriteTrace: () => {},
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

  const c = new DebuggerClient({
    adapter: new ProxyAdapter({
      backendUrl: configContext?.backendURL as unknown as string,
    }),
  });

  const [client, setClient] = useState(
    new DebuggerClient({
      adapter: new ProxyAdapter({
        backendUrl: configContext?.backendURL as unknown as string,
      }),
    }),
  );

  const handleDeleteHistoryTrace = (uniqueId: string) => {
    localStorage.setItem(
      "traces",
      JSON.stringify(
        historyTraces.filter((trace) => trace.uniqueId !== uniqueId),
      ),
    );
    setHistoryTraces((previousTraces) => {
      return previousTraces.filter((trace) => trace.uniqueId !== uniqueId);
    });
  };
  const handleDeleteFavouriteTrace = (traceId: string) => {
    localStorage.setItem(
      "favourites",
      JSON.stringify(favourites.filter((trace) => trace.trace.id !== traceId)),
    );
    setFavourites((previousFavourites) => {
      return previousFavourites.filter((trace) => trace.trace.id !== traceId);
    });
  };

  const handleSetHistoryTraces = (trace: HistoryTrace) => {
    localStorage.setItem("traces", JSON.stringify([...historyTraces, trace]));
    setHistoryTraces((previousTraces) => {
      return [...previousTraces, trace];
    });
  };

  const handleSetFavourites = (trace: HistoryTrace) => {
    localStorage.setItem("favourites", JSON.stringify([...favourites, trace]));
    setFavourites((previousTraces) => {
      return [...previousTraces, trace];
    });
  };

  const handleSetClient = (url: string) => {
    setClient(
      new DebuggerClient({
        adapter: new ProxyAdapter({
          backendUrl: url,
        }),
      }),
    );
  };

  useEffect(() => {
    setClient(
      new DebuggerClient({
        adapter: new ProxyAdapter({
          backendUrl: configContext?.backendURL as unknown as string,
        }),
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
        handleDeleteFavouriteTrace,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}
