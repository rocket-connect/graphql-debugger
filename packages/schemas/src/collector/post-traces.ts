import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Recursive type
const AnyValueSchema = z.lazy(() => AnyValueInnerSchema) as z.ZodUnion<
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [...z.ZodTypeAny[]]
>;

const KeyValueSchema = z.object({
  key: z.string(),
  value: AnyValueSchema,
});

const ArrayValueSchema = z.object({
  values: z.array(AnyValueSchema),
});

const KeyValueListSchema = z.object({
  values: z.array(KeyValueSchema),
});

const AnyValueInnerSchema = z.union([
  z.object({ stringValue: z.string().nullable() }),
  z.object({ boolValue: z.boolean().nullable() }),
  z.object({ intValue: z.number().nullable() }),
  z.object({ doubleValue: z.number().nullable() }),
  z.object({ arrayValue: ArrayValueSchema }),
  z.object({ kvlistValue: KeyValueListSchema }),
  z.object({ bytesValue: z.instanceof(Uint8Array) }),
]);

const InstrumentationScopeSchema = z.object({
  name: z.string(),
  version: z.string().optional(),
  attributes: z.array(KeyValueSchema).optional(),
  droppedAttributesCount: z.number().optional(),
});

const ResourceSchema = z.object({
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});

const EventSchema = z.object({
  timeUnixNano: z.number(),
  name: z.string(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});

const LinkSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  traceState: z.string().optional(),
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number(),
});

const StatusSchema = z.object({
  message: z.string().optional(),
  code: z.number(),
});

const OTELSpan = z.object({
  id: z.string(),
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

const ScopeSpansSchema = z.object({
  scope: InstrumentationScopeSchema.optional(),
  spans: z.array(OTELSpan),
  schemaUrl: z.string().nullable().optional(),
});

const ResourceSpansSchema = z.object({
  resource: ResourceSchema.optional(),
  scopeSpans: z.array(ScopeSpansSchema),
  schemaUrl: z.string().optional(),
});

const ExportTraceServiceRequestSchema = z.object({
  resourceSpans: z.array(ResourceSpansSchema),
});

export const PostTracesSchema = z.object({
  body: ExportTraceServiceRequestSchema.required(),
});
