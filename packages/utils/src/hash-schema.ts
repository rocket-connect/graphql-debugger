import { GraphQLSchema, lexicographicSortSchema, printSchema } from 'graphql';
import crypto from 'crypto';

export function hashSchema(schema: GraphQLSchema): string {
  const sorted = lexicographicSortSchema(schema);
  const printed = printSchema(sorted);

  const hash = crypto.createHash('sha256');
  hash.update(printed);

  return hash.digest('hex');
}
