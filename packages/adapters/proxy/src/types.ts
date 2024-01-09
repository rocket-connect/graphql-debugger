import { BaseAdapter } from "@graphql-debugger/adapter-base";

import { type Source } from "graphql";

export interface ClientOptions {
  adapter?: BaseAdapter;
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
