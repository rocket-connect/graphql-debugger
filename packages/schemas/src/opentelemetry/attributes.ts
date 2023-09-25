import { z } from "zod";

import { KeyValueSchema } from ".";

export const AttributesSchema = z.array(KeyValueSchema);
