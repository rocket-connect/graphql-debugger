/* eslint-disable @typescript-eslint/ban-ts-comment */
import { prisma } from "@graphql-debugger/data-access";
import { isTraceError } from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";

import { UnixNanoTimeStamp } from "../../packages/time/build";
import { Schemas } from "./components/schemas";
import { TraceViewer } from "./components/trace-viewer";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";
import { sleep } from "./utils/sleep";

describe("trace-viewer", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should load a trace viewer correctly", async () => {
    const randomFieldName = faker.string.alpha(8);

    const variants = [
      {
        shouldError: false,
        randomFieldName,
      },
      {
        shouldError: true,
        randomFieldName,
      },
    ];

    const page = await getPage({ browser });

    const dashboardPage = new Dashboard({
      browser,
      page,
    });
    await dashboardPage.init();

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");
    await sleep(500);

    const schemasComponent = new Schemas({
      browser,
      page: dashboardPage,
    });
    await schemasComponent.init();

    const testVariant = async (variant: {
      shouldError: boolean;
      randomFieldName: string;
    }) => {
      const { dbSchema, schema, query } = await createTestSchema(variant);

      const response = await querySchema({
        schema: schema,
        query: query,
      });
      if (variant.shouldError) {
        expect(response.errors).toBeDefined();
      } else {
        expect(response.errors).toBeUndefined();
      }
      await sleep(500);

      const traces = await prisma.traceGroup.findMany({
        where: {
          schemaId: dbSchema.id,
        },
        include: {
          spans: true,
        },
      });

      let trace = traces[0];
      if (variant.shouldError) {
        // @ts-ignore
        trace = traces.find((t) => isTraceError(t));
      } else {
        // @ts-ignore
        trace = traces.find((t) => !isTraceError(t));
      }

      await page.reload();
      await sleep(500);
      await schemasComponent.clickSchema(dbSchema);

      const tracesComponent = new Traces({
        browser,
        page: dashboardPage,
      });

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

      if (variant.shouldError) {
        const red = "rgb(239, 68, 68)";
        expect(pillComponent.color).toBe(red);
      } else {
        const neturalColor = "rgb(59, 75, 104)";
        expect(pillComponent.color).toBe(neturalColor);
      }

      const uiSpans = await traceViewerComponent.getSpans();
      expect(uiSpans.length).toBe(trace.spans.length);

      trace.spans.forEach((span) => {
        const uiSpan = uiSpans.find((uiS) => uiS.name === span.name);
        expect(uiSpan?.name).toBe(span.name);

        if (variant.shouldError) {
          const red = "rgba(59, 75, 104, 0.3)";
          expect(uiSpan?.color).toBe(red);
        } else {
          const green = "rgba(59, 75, 104, 0.3)";
          expect(uiSpan?.color).toBe(green);
        }

        const durationNano = new UnixNanoTimeStamp(span.durationNano);
        const { value, unit } = durationNano.toSIUnits();

        expect(uiSpan?.time).toBe(`${value.toFixed(2)} ${unit}`);
      });
    };

    const variant1 = variants[0];
    await testVariant(variant1);

    const variant2 = variants[1];
    await testVariant(variant2);
  });
});
