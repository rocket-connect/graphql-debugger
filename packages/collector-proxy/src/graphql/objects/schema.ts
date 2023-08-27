import { prisma } from '../../prisma';
import { builder } from '../schema';
import { Trace, TraceObject } from './trace';

export type Schema = {
  id: string;
  hash: string;
  name?: string;
  typeDefs: string;
  traceGroups: Trace[];
};

export const SchemaObject = builder.objectType('Schema', {
  fields: (t) => ({
    id: t.exposeID('id'),
    hash: t.exposeString('hash'),
    name: t.exposeString('name', { nullable: true }),
    typeDefs: t.exposeString('typeDefs'),
    traceGroups: t.field({
      type: [TraceObject],
      resolve: async (root) => {
        const traceGroups = await prisma.traceGroup.findMany({
          where: {
            schemaId: root.id,
          },
        });

        return traceGroups.map((traceGroup) => ({
          id: traceGroup.id,
          traceId: traceGroup.traceId,
          spans: [],
        }));
      },
    }),
  }),
});
