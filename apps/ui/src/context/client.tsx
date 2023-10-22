import { DebuggerClient } from "@graphql-debugger/client";
import type { Trace } from "@graphql-debugger/types";

import {
  ReactNode,
  createContext,
  useCallback,
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

  const [client, setClient] = useState(
    new DebuggerClient({
      backendUrl: configContext?.backendURL,
    }),
  );

  const handleDeleteHistoryTrace = useCallback(
    (uniqueId: string) => {
      setHistoryTraces((previousTraces) => {
        const newTraces = previousTraces.filter(
          (trace) => trace.uniqueId !== uniqueId,
        );

        return newTraces;
      });
    },
    [setHistoryTraces],
  );

  const handleDeleteFavouriteTrace = useCallback(
    (traceId: string) => {
      setFavourites((previousFavourites) => {
        const newFavourites = previousFavourites.filter(
          (trace) => trace.trace.id !== traceId,
        );

        return newFavourites;
      });
    },
    [setFavourites],
  );

  const handleSetHistoryTraces = useCallback(
    (trace: HistoryTrace) => {
      setHistoryTraces((previousTraces) => {
        const newTraces = previousTraces.filter(
          (t) => t.uniqueId !== trace.uniqueId,
        );

        return [...newTraces, trace];
      });
    },
    [setHistoryTraces],
  );

  const handleSetFavourites = useCallback(
    (trace: HistoryTrace) => {
      setFavourites((previousTraces) => {
        return [...previousTraces, trace];
      });
    },
    [setFavourites],
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

  useEffect(() => {
    localStorage.setItem("traces", JSON.stringify(historyTraces));
  }, [historyTraces]);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

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
