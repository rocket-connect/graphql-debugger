import { z } from "zod";

import { SpanSchema } from "../..";

export const CreateSpanInput = z.object({
  spanId: z.string(),
  parentSpanId: z.string().optional().nullable(),
  name: z.string(),
  kind: z.number(),
  startTimeUnixNano: z.string(),
  endTimeUnixNano: z.string(),
  traceId: z.string(),
  traceGroupId: z.string(),
  errorMessage: z.string().optional().nullable(),
  errorStack: z.string().optional().nullable(),
  graphqlDocument: z.string().optional().nullable(),
  graphqlVariables: z.string().optional().nullable(),
  graphqlResult: z.string().optional().nullable(),
  graphqlContext: z.string().optional().nullable(),
  graphqlSchemaHash: z.string().optional().nullable(),
  graphqlOperationName: z.string().optional().nullable(),
  graphqlOperationType: z.string().optional().nullable(),
  isForeign: z.boolean().optional().nullable(),
  isGraphQLRootSpan: z.boolean().optional().nullable(),
  attributes: z.string().optional().nullable(),
});

export const CreateSpanResponseSchema = z.object({
  span: SpanSchema,
});
