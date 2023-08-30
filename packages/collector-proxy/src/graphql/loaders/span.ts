import DataLoader from 'dataloader';
import { prisma } from '../../prisma';
import { Span } from '../objects/span';

export function rootSpanLoader() {
  return new DataLoader(async (traceIds: readonly string[]): Promise<(Span | undefined)[]> => {
    const spans = await prisma.span.findMany({
      where: {
        traceGroupId: {
          in: traceIds as string[],
        },
        parentSpanId: null,
      },
    });

    return traceIds.map((traceId) => {
      const span = spans.find((s) => s.traceGroupId === traceId);

      if (!span) {
        return undefined;
      }

      return {
        id: span.id,
        spanId: span.spanId,
        parentSpanId: span.parentSpanId as string,
        traceId: span.traceId,
        name: span.name as string,
        kind: span.kind,
        startTimeUnixNano: span.startTimeUnixNano,
        endTimeUnixNano: span.endTimeUnixNano,
        durationNano: span.durationNano,
        timestamp: 0,
        attributes: span.attributes,
        createdAt: span.createdAt.toString(),
        updatedAt: span.updatedAt.toString(),
        errorMessage: span.errorMessage,
        errorStack: span.errorStack,
      };
    });
  });
}

export function spanLoader() {
  return new DataLoader(async (traceIds: readonly string[]): Promise<Span[][]> => {
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
        return {
          id: span.id,
          spanId: span.spanId,
          parentSpanId: span.parentSpanId as string,
          traceId: span.traceId,
          name: span.name as string,
          kind: span.kind,
          startTimeUnixNano: span.startTimeUnixNano,
          endTimeUnixNano: span.endTimeUnixNano,
          durationNano: span.durationNano,
          attributes: span.attributes,
          timestamp: 0,
          createdAt: span.createdAt.toString(),
          updatedAt: span.updatedAt.toString(),
          errorMessage: span.errorMessage,
          errorStack: span.errorStack,
        };
      });
    });
  });
}
