import { prisma } from '../../prisma';
import { builder } from '../schema';

export type DeleteTracesWhere = {
  schemaId: string;
  rootSpanName?: string;
};

export type DeleteTracesResponse = {
  success: boolean;
};

export const DeleteTracesWhere = builder.inputType('DeleteTracesWhere', {
  fields: (t) => ({
    schemaId: t.string({
      required: true,
    }),
    rootSpanName: t.string({
      required: false,
    }),
  }),
});

export const DeleteTracesResponse = builder.objectType('DeleteTracesResponse', {
  fields: (t) => ({
    success: t.exposeBoolean('success'),
  }),
});

builder.mutationField('deleteTraces', (t) =>
  t.field({
    type: DeleteTracesResponse,
    args: {
      where: t.arg({
        type: DeleteTracesWhere,
        required: true,
      }),
    },
    resolve: async (root, args) => {
      const where = {
        schemaId: args.where.schemaId,
        ...(args.where?.rootSpanName
          ? {
              spans: {
                some: {
                  parentSpanId: null,
                  name: {
                    equals: args.where?.rootSpanName,
                  },
                },
              },
            }
          : {}),
      };

      await prisma.traceGroup.deleteMany({
        where,
      });

      return {
        success: true,
      };
    },
  })
);
