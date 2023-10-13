import { Schema } from "@graphql-debugger/types";

import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useEffect, useState } from "react";

import { client } from "../client";

export interface SchemasContextProps {
  selectedSchema?: Schema;
  schemas: Schema[];
  isLoading?: boolean;
  setSchema: (schema: Schema) => void;
  setSchemas: (schemas: Schema[]) => void;
}

export const SchemasContext = createContext<SchemasContextProps | undefined>(
  undefined,
);

export function SchemasProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [selectedSchema, setSchema] = useState<Schema>();
  const [schemas, setSchemas] = useState<Schema[]>([]);

  const getSchemas = useQuery({
    queryKey: ["schemas"],
    queryFn: async () => await client.schema.findMany(),
    networkMode: "always",
  });

  useEffect(() => {
    if (getSchemas.data) {
      setSchemas(getSchemas.data);
    }
  }, [getSchemas]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!schemas.length) {
        getSchemas.refetch();
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [schemas, getSchemas]);

  return (
    <SchemasContext.Provider
      value={{
        selectedSchema,
        setSchema,
        schemas,
        setSchemas,
        isLoading: getSchemas.isLoading,
      }}
    >
      {children}
    </SchemasContext.Provider>
  );
}
