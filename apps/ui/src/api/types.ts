import type {
  ListTraceGroupsResponse,
  ListTraceGroupsWhere,
} from "@graphql-debugger/types";

import { type Source } from "graphql";

export interface GraphQLRequest<Variables> {
  query: string | Source;
  variables?: Variables;
}

export interface GraphQLResponse<Data> extends Response {
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
