-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Span" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spanId" TEXT NOT NULL,
    "parentSpanId" TEXT,
    "traceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "startTimeUnixNano" BIGINT NOT NULL,
    "endTimeUnixNano" BIGINT NOT NULL,
    "durationNano" BIGINT NOT NULL,
    "isForeign" BOOLEAN NOT NULL DEFAULT true,
    "isGraphQLRootSpan" BOOLEAN NOT NULL DEFAULT false,
    "graphqlDocument" TEXT,
    "graphqlVariables" TEXT,
    "graphqlResult" TEXT,
    "graphqlContext" TEXT,
    "graphqlSchemaHash" TEXT,
    "attributes" TEXT,
    "errorMessage" TEXT,
    "errorStack" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "traceGroupId" TEXT,
    CONSTRAINT "Span_traceGroupId_fkey" FOREIGN KEY ("traceGroupId") REFERENCES "TraceGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Span" ("attributes", "createdAt", "durationNano", "endTimeUnixNano", "errorMessage", "errorStack", "graphqlContext", "graphqlDocument", "graphqlResult", "graphqlSchemaHash", "graphqlVariables", "id", "isForeign", "kind", "name", "parentSpanId", "spanId", "startTimeUnixNano", "traceGroupId", "traceId", "updatedAt") SELECT "attributes", "createdAt", "durationNano", "endTimeUnixNano", "errorMessage", "errorStack", "graphqlContext", "graphqlDocument", "graphqlResult", "graphqlSchemaHash", "graphqlVariables", "id", "isForeign", "kind", "name", "parentSpanId", "spanId", "startTimeUnixNano", "traceGroupId", "traceId", "updatedAt" FROM "Span";
DROP TABLE "Span";
ALTER TABLE "new_Span" RENAME TO "Span";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
