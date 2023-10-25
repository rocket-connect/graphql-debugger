import { BACKEND_PORT } from "@graphql-debugger/backend";
import { prisma } from "@graphql-debugger/data-access";

import util from "util";

import { History } from "./components/history";
import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

const sleep = util.promisify(setTimeout);

describe("history", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should load and display a list of traces", async () => {
    const page = await getPage({ browser });

    const dashboardPage = new Dashboard({
      browser,
      page,
    });
    await dashboardPage.init();

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.init();

    const { dbSchema, schema, query, randomFieldName } =
      await createTestSchema();

    const { schema: failSchema } = await createTestSchema({
      randomFieldName,
      shouldError: true,
    });

    await schemasComponent.clickSchema(dbSchema);

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();

    const responses = await Promise.all([
      querySchema({
        schema: schema,
        query: query,
      }),
      querySchema({
        schema: failSchema,
        query: query,
      }),
    ]);

    expect(responses[0].errors).toBeUndefined();
    expect(responses[1].errors).toBeDefined();

    await page.reload();

    await prisma.traceGroup.findMany({
      where: {
        schemaId: dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
      trace: traceComponent,
    });
    await tracesComponent.init();

    const uiTraces = await tracesComponent.getUITraces();
    expect(uiTraces.length).toEqual(2);

    const uiTrace1 = uiTraces[0];
    const uiTrace2 = uiTraces[1];

    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: uiTrace1.id,
    });

    await sleep(500);

    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: uiTrace2.id,
    });

    await sleep(500);

    await sidebar.toggleView("history");

    await page.goto(`http://localhost:${BACKEND_PORT}/`, {
      waitUntil: "networkidle0",
    });
    await page.reload({
      waitUntil: "networkidle0",
    });
    await sleep(500);

    const historyComponent = new History({
      browser,
      page: dashboardPage,
    });
    await historyComponent.init();

    const [uiHistoryTrace2, uiHistoryTrace1] =
      await historyComponent.getUITraces();

    expect(uiHistoryTrace1.name).toEqual(uiTrace1.name);
    expect(uiHistoryTrace1.start).toEqual(`- ${uiTrace1.start}`);

    expect(uiHistoryTrace2.name).toEqual(uiTrace2.name);
    expect(uiHistoryTrace2.start).toEqual(`- ${uiTrace2.start}`);

    await historyComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: uiHistoryTrace1.id,
    });
    await sleep(500);

    await historyComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: uiHistoryTrace2.id,
    });
    await sleep(500);

    await historyComponent.deleteItem({
      schemaId: dbSchema.id,
      traceId: uiHistoryTrace1.id,
    });
    await sleep(500);

    await historyComponent.deleteItem({
      schemaId: dbSchema.id,
      traceId: uiHistoryTrace2.id,
    });
    await sleep(500);

    const newUiTraces = await historyComponent.getUITraces();

    expect(newUiTraces.length).toEqual(0);
  });
});
