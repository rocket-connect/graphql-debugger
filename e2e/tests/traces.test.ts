import {
  getTraceStart,
  isTraceError,
  sumTraceTime,
} from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";

import { client } from "../src/client";
import { Schemas } from "./components/schemas";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { colors } from "./utils/colors";
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

  const randomFieldName = faker.string.alpha(8);

  const variants = [
    {
      name: "should load and display a list of success traces",
      shouldError: false,
      randomFieldName,
    },
    {
      name: "should load and display a list of error traces",
      shouldError: true,
      randomFieldName,
    },
    {
      name: "should load and display a list of named query traces",
      shouldError: false,
      randomFieldName,
      shouldNameQuery: true,
    },
  ];

  for (const variant of variants) {
    test(variant.name, async () => {
      const page = await getPage({ browser });
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

      await page.reload();
      await sleep(500);

      const traces = await client.trace.findMany({
        where: {
          schemaId: dbSchema.id,
        },
        includeSpans: true,
      });

      const tracesComponent = new Traces({
        browser,
        page: dashboardPage,
      });
      await tracesComponent.assert();

      const uiTraces = await tracesComponent.getUITraces();
      expect(uiTraces.length).toEqual(1);

      traces.forEach((trace) => {
        const isError = isTraceError(trace);
        const rootSpan = trace.spans.find((span) => span.isGraphQLRootSpan);

        const uiTrace = uiTraces.find((t) => t.id === trace.id);
        expect(uiTrace).toBeDefined();
        if (rootSpan?.graphqlOperationName) {
          expect(uiTrace?.name).toBe(
            `${rootSpan?.graphqlOperationType} ${variant.randomFieldName}`,
          );
        } else {
          expect(uiTrace?.name).toEqual(rootSpan?.name);
        }

        const duration = sumTraceTime({
          id: trace.id,
          traceId: trace.traceId,
          spans: trace.spans,
        });

        const traceDurationSIUnits = duration?.toSIUnits();
        const { value, unit } = traceDurationSIUnits;
        expect(uiTrace?.duration).toEqual(`${value.toFixed(2)} ${unit}`);

        const startTimeUnixNano = getTraceStart({
          id: trace.id,
          traceId: trace.traceId,
          spans: trace.spans,
        });
        expect(uiTrace?.start).toEqual(
          startTimeUnixNano.formatUnixNanoTimestamp(),
        );

        const color = uiTrace?.color;

        if (isError) {
          expect(color).toEqual(colors.red_text);
        } else {
          expect(color).toBe(colors.netural_text);
        }
      });
    });
  }
});
