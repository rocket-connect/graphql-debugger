import { BACKEND_PORT } from "@graphql-debugger/backend";

import { History } from "./components/history";
import { Schemas } from "./components/schemas";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";
import { sleep } from "./utils/sleep";

describe("history", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should add traces to history and remove them", async () => {
    const page = await getPage({ browser });

    const dashboardPage = new Dashboard({
      browser,
      page,
    });

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });

    const { dbSchema, schema, query, randomFieldName } =
      await createTestSchema();

    const { schema: failSchema } = await createTestSchema({
      randomFieldName,
      shouldError: true,
    });

    await schemasComponent.clickSchema(dbSchema);

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
    await sleep(200);

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
    });

    const uiTraces = await tracesComponent.getUITraces();
    expect(uiTraces.length).toEqual(2);

    const uiTrace1 = uiTraces[0];
    const uiTrace2 = uiTraces[1];

    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: uiTrace1.id,
    });
    await sleep(200);

    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: uiTrace2.id,
    });
    await sleep(200);

    await sidebar.toggleView("history");

    await page.goto(`http://localhost:${BACKEND_PORT}/`);
    await sleep(500);

    const historyComponent = new History({
      browser,
      page: dashboardPage,
    });
    await historyComponent.assert();

    const [uiHistoryTrace2, uiHistoryTrace1] =
      await historyComponent.getUITraces();

    expect(uiHistoryTrace1.name).toEqual(uiTrace1.name);
    expect(uiHistoryTrace1.start).toEqual(`- ${uiTrace1.start}`);

    expect(uiHistoryTrace2.name).toEqual(uiTrace2.name);
    expect(uiHistoryTrace2.start).toEqual(`- ${uiTrace2.start}`);

    await historyComponent.assertLink({
      traceId: uiHistoryTrace1.id,
    });
    await historyComponent.assertLink({
      traceId: uiHistoryTrace2.id,
    });

    await historyComponent.deleteItem({
      schemaId: dbSchema.id,
      traceId: uiHistoryTrace1.id,
    });
    await historyComponent.deleteItem({
      schemaId: dbSchema.id,
      traceId: uiHistoryTrace2.id,
    });
    await sleep(200);

    const newUiTraces = await historyComponent.getUITraces();

    expect(newUiTraces.length).toEqual(0);
  });
});
