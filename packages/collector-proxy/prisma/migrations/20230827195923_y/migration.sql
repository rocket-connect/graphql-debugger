-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TraceGroup" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "traceId" TEXT NOT NULL,
    "schemaId" TEXT,
    CONSTRAINT "TraceGroup_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_TraceGroup" ("createdAt", "id", "traceId", "updatedAt") SELECT "createdAt", "id", "traceId", "updatedAt" FROM "TraceGroup";
DROP TABLE "TraceGroup";
ALTER TABLE "new_TraceGroup" RENAME TO "TraceGroup";
CREATE UNIQUE INDEX "TraceGroup_traceId_key" ON "TraceGroup"("traceId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
