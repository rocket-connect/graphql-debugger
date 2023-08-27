-- CreateTable
CREATE TABLE "TraceGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "traceId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Span" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "spanId" TEXT NOT NULL,
    "parentSpanId" TEXT,
    "traceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "startTimeUnixNano" BIGINT NOT NULL,
    "endTimeUnixNano" BIGINT NOT NULL,
    "attributes" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "traceGroupId" TEXT,
    CONSTRAINT "Span_traceGroupId_fkey" FOREIGN KEY ("traceGroupId") REFERENCES "TraceGroup" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
