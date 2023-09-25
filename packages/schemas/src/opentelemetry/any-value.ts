import { z } from "zod";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Recursive type
export const AnyValueSchema = z.lazy(() => AnyValueInnerSchema) as z.ZodUnion<
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  [...z.ZodTypeAny[]]
>;

export const KeyValueSchema = z.object({
  key: z.string(),
  value: AnyValueSchema,
});

export const KeyValueListSchema = z.object({
  values: z.array(
    z.object({
      key: z.string(),
      value: AnyValueSchema,
    }),
  ),
});

export const AnyValueInnerSchema = z.union([
  z.object({ stringValue: z.string().nullable() }),
  z.object({ boolValue: z.boolean().nullable() }),
  z.object({ intValue: z.number().nullable() }),
  z.object({ doubleValue: z.number().nullable() }),
  z.object({
    arrayValue: z.object({
      values: z.array(AnyValueSchema),
    }),
  }),
  z.object({ kvlistValue: KeyValueListSchema }),
  z.object({ bytesValue: z.instanceof(Uint8Array) }),
]);
