import { prisma } from "@graphql-debugger/data-access";

import util from "util";

import { UnixNanoTimeStamp } from "../../packages/time/build";
import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { TraceViewer } from "./components/trace-viewer";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

const sleep = util.promisify(setTimeout);

describe("trace-viewer", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should load a trace viewer correctly", async () => {
    const page = await getPage({ browser });
    const { dbSchema, schema, query } = await createTestSchema();

    const response = await querySchema({
      schema: schema,
      query: query,
    });
    expect(response.errors).toBeUndefined();
    await sleep(200);
    await page.reload();

    const [trace] = await prisma.traceGroup.findMany({
      where: {
        schemaId: dbSchema.id,
      },
      include: {
        spans: true,
      },
    });

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
    await schemasComponent.clickSchema(dbSchema);

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
      trace: traceComponent,
    });
    await tracesComponent.init();
    await tracesComponent.clickTrace({
      schemaId: dbSchema.id,
      traceId: trace.id,
    });
    await sleep(500);

    const traceViewerComponent = new TraceViewer({
      browser,
      page: dashboardPage,
    });
    await traceViewerComponent.init();
    await traceViewerComponent.expand();

    const pillComponent = await traceViewerComponent.getPill();
    expect(pillComponent.name).toBeTruthy();

    const uiSpans = await traceViewerComponent.getSpans();
    expect(uiSpans.length).toBe(trace.spans.length);

    trace.spans.forEach((span) => {
      const uiSpan = uiSpans.find((us) => us.name === span.name);
      expect(uiSpan?.name).toBe(span.name);

      const green = "rgba(59, 75, 104, 0.3)";
      expect(uiSpan?.color).toBe(green);

      const durationNano = new UnixNanoTimeStamp(span.durationNano);
      const { value, unit } = durationNano.toSIUnits();

      expect(uiSpan?.time).toBe(`${value.toFixed(2)} ${unit}`);
    });
  });
});
