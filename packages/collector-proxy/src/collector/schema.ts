import { z } from 'zod';

// @ts-ignore - Recursive type
export const AnyValueSchema = z.lazy(() => AnyValueInnerSchema) as z.ZodUnion<[...z.ZodTypeAny[]]>;

export const KeyValueSchema = z.object({
  key: z.string(),
  value: AnyValueSchema,
});

export const ArrayValueSchema = z.object({
  values: z.array(AnyValueSchema),
});

export const KeyValueListSchema = z.object({
  values: z.array(KeyValueSchema),
});

export const AnyValueInnerSchema = z.union([
  z.object({ stringValue: z.string().nullable() }),
  z.object({ boolValue: z.boolean().nullable() }),
  z.object({ intValue: z.number().nullable() }),
  z.object({ doubleValue: z.number().nullable() }),
  z.object({ arrayValue: ArrayValueSchema }),
  z.object({ kvlistValue: KeyValueListSchema }),
  z.object({ bytesValue: z.instanceof(Uint8Array) }),
]);

export const InstrumentationScopeSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  attributes: z.array(KeyValueSchema).optional(),
  droppedAttributesCount: z.number().optional(),
});

export const ResourceSchema = z.object({
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});

export const EventSchema = z.object({
  timeUnixNano: z.number(),
  name: z.string(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});

export const LinkSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  traceState: z.string().optional(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});

export const StatusSchema = z.object({
  message: z.string().optional(),
  code: z.number(),
});

export const SpanSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  traceState: z.string().nullable().optional(),
  parentSpanId: z.string().optional(),
  name: z.string(),
  kind: z.number(),
  startTimeUnixNano: z.number(),
  endTimeUnixNano: z.number(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number().optional(),
  events: z.array(EventSchema).optional(),
  droppedEventsCount: z.number().optional(),
  links: z.array(LinkSchema).optional(),
  droppedLinksCount: z.number().optional(),
  status: StatusSchema,
});

export const ScopeSpansSchema = z.object({
  scope: InstrumentationScopeSchema.optional(),
  spans: z.array(SpanSchema),
  schemaUrl: z.string().nullable().optional(),
});

export const ResourceSpansSchema = z.object({
  resource: ResourceSchema.optional(),
  scopeSpans: z.array(ScopeSpansSchema),
  schemaUrl: z.string().optional(),
});

export const ExportTraceServiceRequestSchema = z.object({
  resourceSpans: z.array(ResourceSpansSchema),
});

export const ExportTracePartialSuccessSchema = z.object({
  rejectedSpans: z.number().optional(),
  errorMessage: z.string().optional(),
});

export const ExportTraceServiceResponseSchema = z.object({
  partialSuccess: ExportTracePartialSuccessSchema.optional(),
});

export const schema = z.object({
  body: ExportTraceServiceRequestSchema.required(),
});
