import { z } from "zod";

export const ExtractedSpanSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  parentSpanId: z.string().optional(),
  name: z.string(),
  kind: z.number(),
  startTimeUnixNano: z.string(),
  endTimeUnixNano: z.string(),
  isForeign: z.boolean(),
  attributes: z.record(z.string()).optional(),
  graphqlSchemaHash: z.string().optional(),
  graphqlOperationName: z.string().optional(),
  graphqlOperationType: z.string().optional(),
  graphqlDocument: z.string().optional(),
  graphqlVariables: z.string().optional(),
  graphqlResult: z.string().optional(),
  graphqlContext: z.string().optional(),
  errorMessage: z.string().optional(),
  errorStack: z.string().optional(),
});
