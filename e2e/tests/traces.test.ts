import { prisma } from "@graphql-debugger/data-access";

// import { sumTraceTime } from "@graphql-debugger/utils";
import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

describe("traces", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
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

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.init();
    await schemasComponent.clickSchema(dbSchema);

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
    expect(uiTraces.length).toEqual(1);

    const uiTrace = uiTraces.find((t) => t.id === trace.id);
    expect(uiTrace).toBeDefined();

    // const duration = sumTraceTime({
    //   id: trace.id,
    //   traceId: trace.traceId,
    // });

    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: trace.id,
    });
  });
});
