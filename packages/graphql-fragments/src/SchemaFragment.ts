import gql from "gql-tag";

export const SchemaFragment = gql`
  fragment SchemaFragment on Schema {
    id
    hash
    name
    typeDefs
    createdAt
  }
`;
