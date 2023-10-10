import type {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "@graphql-debugger/types";

import { type Source } from "graphql";

export interface ClientOptions {
  backendUrl?: string;
  collectorUrl?: string;
}

export interface GraphQLRequest<Variables> {
  url: string;
  query: string | Source;
  variables?: Variables;
}

export interface GraphQLResponse<Data> {
  data: Data;
  errors: any[];
}

export type GraphQLResponseData<Data> = Pick<
  GraphQLResponse<Data>,
  "data" | "errors"
>;

export interface ListTraceGroupsDataResponse {
  listTraceGroups: ListTraceGroupsResponse;
}

export interface ListTraceGroupsVariables {
  where?: ListTraceGroupsWhere;
  includeSpans?: boolean;
  includeRootSpan?: boolean;
}
