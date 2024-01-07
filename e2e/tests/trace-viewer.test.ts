import { prisma } from "@graphql-debugger/data-access";
import { isSpanError, isTraceError } from "@graphql-debugger/utils";

import { faker } from "@faker-js/faker";

import { UnixNanoTimeStamp } from "../../packages/time/build";
import { Schemas } from "./components/schemas";
import { TraceViewer } from "./components/trace-viewer";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { colors } from "./utils/colors";
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

  const randomFieldName = faker.string.alpha(8);

  const variants = [
    {
      name: "should load a success trace viewer correctly",
      shouldError: false,
      randomFieldName,
    },
    {
      name: "should load a error trace viewer correctly",
      shouldError: true,
      randomFieldName,
    },
    {
      name: "should load a named query in the trace viewer correctly",
      shouldError: false,
      randomFieldName,
      shouldNameQuery: true,
    },
  ];

  for (const variant of variants) {
    test(variant.name, async () => {
      const { dbSchema, schema, query } = await createTestSchema(variant);
      const page = await getPage({ browser });
      const dashboardPage = new Dashboard({
        browser,
        page,
      });

      const sidebar = await dashboardPage.getSidebar();
      const view = await sidebar.toggleView("schemas");
      if (!view) {
        await sidebar.toggleView("schemas");
      }
      await sleep(200);

      const schemasComponent = new Schemas({
        browser,
        page: dashboardPage,
      });

      const response = await querySchema({ schema, query });
      if (variant.shouldError) {
        expect(response.errors).toBeDefined();
      } else {
        expect(response.errors).toBeUndefined();
      }
      await sleep(200);

      // TODO - unify client
      const traces = await prisma.traceGroup.findMany({
        where: {
          schemaId: dbSchema.id,
        },
        include: {
          spans: true,
        },
      });

      const trace = variant.shouldError
        ? traces.find((t) => isTraceError(t))
        : traces.find((t) => !isTraceError(t));

      await page.reload();
      await sleep(200);
      await schemasComponent.clickSchema(dbSchema);

      const tracesComponent = new Traces({
        browser,
        page: dashboardPage,
      });

      await tracesComponent.clickTrace({
        schemaId: dbSchema.id,
        traceId: trace?.id as string,
      });
      await sleep(200);

      const traceViewerComponent = new TraceViewer({
        browser,
        page: dashboardPage,
      });
      await traceViewerComponent.assert();
      await sleep(200);

      const rootSpan = trace?.spans.find((span) => span.isGraphQLRootSpan);

      for (const isExpanded of [
        false,
        ...(process.env.SKIP_MODAL ? [] : [true]),
      ]) {
        if (isExpanded) {
          await traceViewerComponent.expand();

          const pillComponent = await traceViewerComponent.getPill();
          if (variant.shouldNameQuery) {
            expect(pillComponent.name).toBe(
              `${rootSpan?.graphqlOperationType} ${variant.randomFieldName}`,
            );
          } else {
            expect(pillComponent.name).toBe(rootSpan?.name);
          }

          const colorToExpect = variant.shouldError
            ? colors.red_text
            : colors.netural_text;
          expect(pillComponent.color).toBe(colorToExpect);
        }

        const uiSpans = await traceViewerComponent.getSpans({
          isExpanded,
        });
        expect(uiSpans.length).toBe(trace?.spans.length);

        for (const span of trace?.spans || []) {
          const uiSpan = uiSpans.find((uiS) => uiS.id === span.id);
          expect(uiSpan?.name).toBe(span.name);

          if (variant.shouldError && isSpanError(span)) {
            expect(uiSpan?.color).toBe(colors.red_text);
          } else {
            expect(uiSpan?.color).toBe(colors.green_text);
          }

          const durationNano = new UnixNanoTimeStamp(span.durationNano);
          const { value, unit } = durationNano.toSIUnits();
          expect(uiSpan?.time).toBe(`${value.toFixed(2)} ${unit}`);
        }
      }
    });
  }
});
