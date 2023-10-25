import { prisma } from "@graphql-debugger/data-access";

import { Schema } from "./components/schema";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

describe("traces", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should load and display a list of traces", async () => {
    const page = await getPage({ browser });
    const { dbSchema, schema, query } = await createTestSchema();

    const dashboardPage = new Dashboard({
      browser,
      page,
    });
    await dashboardPage.init();

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemaComponent = new Schema({
      browser,
      page: dashboardPage,
      dbSchema,
    });
    await schemaComponent.init();

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();

    const response = await querySchema({
      schema: schema,
      query: query,
    });
    expect(response.errors).toBeUndefined();
    await page.reload();

    const [trace] = await prisma.traceGroup.findMany({
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
    const uiTrace = uiTraces.find((t) => t.id === trace.id);
    expect(uiTrace).toBeDefined();

    expect(uiTraces.length).toEqual(1);
    expect(uiTraces[0].id).toEqual(trace.id);
    expect(uiTraces[0].name).toEqual(
      trace.spans.find((span) => span.isGraphQLRootSpan)?.name,
    );

    await tracesComponent.clickTrace(trace.id);
    const url = await page.url();
    expect(url).toContain(`/schema/${dbSchema.id}/trace/${trace.id}`);
  });
});
