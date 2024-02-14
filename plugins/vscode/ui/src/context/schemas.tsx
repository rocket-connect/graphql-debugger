import { Schema } from "@graphql-debugger/types";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
} from "react";

import { ClientContext } from "./client";

export interface SchemasContextProps {
  schemas: Schema[];
  isLoading?: boolean;
  schemaRef: React.MutableRefObject<Schema | undefined>;
  setSelectedSchema: (schema: Schema | undefined) => void;
}

export const SchemasContext = createContext<SchemasContextProps | undefined>(
  undefined,
);

export function SchemasProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const schemaRef = useRef<Schema>();
  const { client } = useContext(ClientContext);

  const getSchemas = useQuery({
    queryKey: ["schemas"],
    queryFn: async () => await client.schema.findMany({}),
    refetchInterval: 5000,
  });

  const setSelectedSchema = useCallback(
    (schema: Schema | undefined) => {
      schemaRef.current = schema;

      // This will trigger a re-render
      getSchemas.refetch();
    },
    [getSchemas],
  );

  return (
    <SchemasContext.Provider
      value={{
        setSelectedSchema,
        schemaRef,
        schemas: getSchemas.data || [],
        isLoading: getSchemas.isLoading,
      }}
    >
      {children}
    </SchemasContext.Provider>
  );
}
