import { PrismaClient } from ".prisma/client";

export const prisma = new PrismaClient();

export * from ".prisma/client";
export * from "./clear-db";
export * from "./test-entities";
