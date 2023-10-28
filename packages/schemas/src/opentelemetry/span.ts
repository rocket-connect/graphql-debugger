import { z } from "zod";

import { UnixNanoSchema } from ".";
import { KeyValueSchema } from "./any-value";
import { EventSchema } from "./event";
import { LinkSchema } from "./link";
import { StatusSchema } from "./status";

export const OTELSpanSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  traceState: z.string().nullable().optional(),
  parentSpanId: z.string().optional(),
  name: z.string(),
  kind: z.number(),
  startTimeUnixNano: UnixNanoSchema,
  endTimeUnixNano: UnixNanoSchema,
  attributes: z.array(KeyValueSchema),
  droppedAttributesCount: z.number().optional(),
  events: z.array(EventSchema).optional(),
  droppedEventsCount: z.number().optional(),
  links: z.array(LinkSchema).optional(),
  droppedLinksCount: z.number().optional(),
  status: StatusSchema,
});
