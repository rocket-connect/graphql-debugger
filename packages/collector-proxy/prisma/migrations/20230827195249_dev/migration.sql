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
CREATE UNIQUE INDEX "Schema_hash_key" ON "Schema"("hash");
