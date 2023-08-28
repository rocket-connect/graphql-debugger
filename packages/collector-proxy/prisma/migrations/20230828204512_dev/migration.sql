-- CreateTable
CREATE TABLE "TraceGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "traceId" TEXT NOT NULL,
    "schemaId" TEXT,
    CONSTRAINT "TraceGroup_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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

-- CreateTable
CREATE TABLE "Schema" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "hash" TEXT NOT NULL,
    "name" TEXT,
    "typeDefs" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TraceGroup_traceId_key" ON "TraceGroup"("traceId");

-- CreateIndex
CREATE UNIQUE INDEX "Schema_hash_key" ON "Schema"("hash");
