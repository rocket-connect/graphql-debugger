import { prisma } from "@graphql-debugger/data-access";
import {
  dbSpanToNetwork,
  getTraceStart,
  isTraceError,
  sumTraceTime,
} from "@graphql-debugger/utils";

import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";
import { sleep } from "./utils/sleep";

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
    await sleep(1000);

    const traces = await prisma.traceGroup.findMany({
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
    });
    await tracesComponent.init();

    const uiTraces = await tracesComponent.getUITraces();
    expect(uiTraces.length).toEqual(2);

    traces.forEach((trace) => {
      const isError = isTraceError(trace);

      const uiTrace = uiTraces.find((t) => t.id === trace.id);
      expect(uiTrace).toBeDefined();

      const duration = sumTraceTime({
        id: trace.id,
        traceId: trace.traceId,
        spans: trace.spans.map((span) => dbSpanToNetwork(span)),
      });

      const traceDurationSIUnits = duration?.toSIUnits();
      const { value, unit } = traceDurationSIUnits;
      expect(uiTrace?.duration).toEqual(`${value.toFixed(2)} ${unit}`);

      const startTimeUnixNano = getTraceStart({
        id: trace.id,
        traceId: trace.traceId,
        spans: trace.spans.map((span) => dbSpanToNetwork(span)),
      });
      expect(uiTrace?.start).toEqual(
        startTimeUnixNano.formatUnixNanoTimestamp(),
      );

      const color = uiTrace?.color;

      if (isError) {
        const red = "rgb(239, 68, 68)";
        expect(color).toEqual(red);
      } else {
        const neturalColor = "rgb(59, 75, 104)";
        expect(color).toBe(neturalColor);
      }
    });
  });
});
