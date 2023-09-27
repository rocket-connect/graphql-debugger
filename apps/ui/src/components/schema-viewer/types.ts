import type { AggregateSpansResponse } from "@graphql-debugger/types";

import type { FieldDefinitionNode } from "graphql";

export interface TypeProps {
  schemaId: string;
  type: {
    name: string;
    kind: string;
    fields: readonly FieldDefinitionNode[];
  };
}

export interface SchemaViewerProps {
  schemaId?: string;
  typeDefs?: string;
}

export interface StatsProps {
  aggregate: AggregateSpansResponse | null;
}

export interface FieldProps {
  field: FieldDefinitionNode;
  parentName: string;
  schemaId: string;
}

