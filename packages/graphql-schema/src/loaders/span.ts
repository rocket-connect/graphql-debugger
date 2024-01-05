import { prisma } from "@graphql-debugger/data-access";
import { Span } from "@graphql-debugger/types";
import { dbSpanToNetwork } from "@graphql-debugger/utils";

import DataLoader from "dataloader";

export function rootSpanLoader() {
  return new DataLoader(
    async (traceIds: readonly string[]): Promise<(Span | undefined)[]> => {
      // TODO - unify client reads
      const spans = await prisma.span.findMany({
        where: {
          traceGroupId: {
            in: traceIds as string[],
          },
          isGraphQLRootSpan: true,
        },
      });

      return traceIds.map((traceId) => {
        const span = spans.find((s) => s.traceGroupId === traceId);

        if (!span) {
          return undefined;
        }

        return dbSpanToNetwork(span);
      });
    },
  );
}

export function spanLoader() {
  return new DataLoader(
    async (traceIds: readonly string[]): Promise<Span[][]> => {
      // TODO - unify client reads
      const spans = await prisma.span.findMany({
        where: {
          traceGroupId: {
            in: traceIds as string[],
          },
        },
      });

      return traceIds.map((traceId) => {
        const _spans = spans.filter((s) => s.traceGroupId === traceId);

        return _spans.map((span) => {
          return dbSpanToNetwork(span);
        });
      });
    },
  );
}
