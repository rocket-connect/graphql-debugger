import { prisma } from '@graphql-debugger/collector-proxy';

export { prisma } from '@graphql-debugger/collector-proxy';

export async function clearDB() {
  await prisma.$transaction(async (tx) => {
    await tx.span.deleteMany();
    await tx.traceGroup.deleteMany();
    await tx.schema.deleteMany();
  });
}
