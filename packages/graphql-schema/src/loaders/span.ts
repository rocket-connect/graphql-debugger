import { DebuggerClient } from "@graphql-debugger/client";
import { Span } from "@graphql-debugger/types";

import DataLoader from "dataloader";

export function rootSpanLoader({ client }: { client: DebuggerClient }) {
  return new DataLoader(
    async (traceIds: readonly string[]): Promise<(Span | undefined)[]> => {
      const { spans } = await client.span.findMany({
        where: {
          traceIds: [...traceIds],
          isGraphQLRootSpan: true,
        },
      });

      return traceIds.map((traceId) => {
        const span = spans.find((s) => s.traceGroupId === traceId);
        if (!span) {
          return undefined;
        }

        return span;
      });
    },
  );
}

export function spanLoader({ client }: { client: DebuggerClient }) {
  return new DataLoader(
    async (traceIds: readonly string[]): Promise<Span[][]> => {
      const { spans } = await client.span.findMany({
        where: {
          traceIds: [...traceIds],
        },
      });

      return traceIds.map((traceId) => {
        const _spans = spans.filter((s) => s.traceGroupId === traceId);
        return _spans;
      });
    },
  );
}
