import { prisma } from "./index";

export async function clearDB() {
  await prisma.$transaction(async (tx) => {
    await tx.span.deleteMany();
    await tx.traceGroup.deleteMany();
    await tx.schema.deleteMany();
  });
}
