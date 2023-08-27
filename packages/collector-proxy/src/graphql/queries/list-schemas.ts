import { prisma } from '../../prisma';
import { SchemaObject, Schema } from '../objects/schema';
import { builder } from '../schema';

export type ListSchemasResponse = {
  schemas: Schema[];
};

export const ListSchemasResponse = builder.objectType('ListSchemasResponse', {
  fields: (t) => ({
    schemas: t.expose('schemas', {
      type: [SchemaObject],
    }),
  }),
});

builder.queryField('listSchemas', (t) =>
  t.field({
    type: ListSchemasResponse,
    resolve: async (root, args) => {
      const schemas = await prisma.schema.findMany();

      return {
        schemas: schemas.map((schema) => ({
          id: schema.id,
          name: schema.name as string | undefined,
          hash: schema.hash,
          typeDefs: schema.typeDefs,
          traceGroups: [],
        })),
      };
    },
  })
);
