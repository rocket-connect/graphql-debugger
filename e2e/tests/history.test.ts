import { BACKEND_PORT } from "@graphql-debugger/backend";
import { prisma } from "@graphql-debugger/data-access";

import { faker } from "@faker-js/faker";

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

  const randomFieldName = faker.string.alpha(8);

  const variants = [
    {
      name: "should add a successful trace to history and remove it",
      shouldError: false,
      randomFieldName,
    },
    // {
    //   name: "should add an error trace to history and remove it",
    //   shouldError: true,
    //   randomFieldName,
    // },
    // {
    //   name: "should add a named query trace to history and remove it",
    //   shouldError: false,
    //   shouldNameQuery: true,
    //   randomFieldName,
    // },
  ];

  for (const variant of variants) {
    test(variant.name, async () => {
      const page = await getPage({ browser });
      const dashboardPage = new Dashboard({
        browser,
        page,
      });
      const sidebar = await dashboardPage.getSidebar();
      await sidebar.toggleView("schemas");

      const schemasComponent = new Schemas({ browser, page: dashboardPage });
      const { dbSchema, schema, query } = await createTestSchema(variant);

      await schemasComponent.clickSchema(dbSchema);

      const response = await querySchema({
        schema: schema,
        query: query,
      });
      if (variant.shouldError) {
        expect(response.errors).toBeDefined();
      } else {
        expect(response.errors).toBeUndefined();
      }

      await page.reload();
      await sleep(200);

      const traces = await prisma.traceGroup.findMany({
        where: {
          schemaId: dbSchema.id,
        },
        include: {
          spans: true,
        },
      });

      const tracesComponent = new Traces({ browser, page: dashboardPage });
      const uiTraces = await tracesComponent.getUITraces();
      expect(uiTraces.length).toEqual(1);

      const uiTrace = uiTraces[0];
      const trace = traces[0];
      const rootSpan = trace.spans.find((span) => span.isGraphQLRootSpan);

      await tracesComponent.clickTrace({
        schemaId: dbSchema.id,
        traceId: uiTrace.id,
      });
      await sidebar.toggleView("history");

      // to stop more than one trace being added to history
      await page.goto(`http://localhost:${BACKEND_PORT}/`);
      await sleep(500);

      const historyComponent = new History({
        browser,
        page: dashboardPage,
      });
      await historyComponent.assert();

      const [uiHistoryTrace] = await historyComponent.getUITraces();

      if (rootSpan?.graphqlOperationName) {
        expect(uiHistoryTrace?.name).toBe(
          `${rootSpan?.graphqlOperationType} ${variant.randomFieldName}`,
        );
      } else {
        expect(uiHistoryTrace?.name).toEqual(rootSpan?.name);
      }

      expect(uiHistoryTrace.start).toEqual(`- ${uiTrace.start}`);

      await historyComponent.assertLink({
        traceId: uiHistoryTrace.id,
      });

      await historyComponent.deleteItem({
        schemaId: dbSchema.id,
        traceId: uiHistoryTrace.id,
      });
      await sleep(200);

      const newUiTraces = await historyComponent.getUITraces();
      expect(newUiTraces.length).toEqual(0);
    });
  }
});
