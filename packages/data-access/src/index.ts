import { PrismaInstrumentation } from "@prisma/instrumentation";

import { PrismaClient } from ".prisma/client";

export const prisma = new PrismaClient();

export const tracing = new PrismaInstrumentation({
  middleware: false,
  ...(process.env.TRACE_PRISMA && {
    enabled: true,
  }),
});

if (!process.env.TRACE_PRISMA) {
  tracing.disable();
}

export * from ".prisma/client";
export * from "./clear-db";
