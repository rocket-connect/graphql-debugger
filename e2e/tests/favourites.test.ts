import { faker } from "@faker-js/faker";

import { client } from "../src/client";
import { Favourites } from "./components/favourites";
import { Schemas } from "./components/schemas";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";
import { sleep } from "./utils/sleep";

describe("favourites", () => {
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
      name: "should add a successful trace to favourites and remove it",
      shouldError: false,
      randomFieldName,
      client,
    },
    {
      name: "should add an error trace to favourites and remove it",
      shouldError: true,
      randomFieldName,
      client,
    },
    {
      name: "should add a named query trace to favourites and remove it",
      shouldError: false,
      shouldNameQuery: true,
      randomFieldName,
      client,
    },
  ];

  for (const variant of variants) {
    test(variant.name, async () => {
      const page = await getPage({ browser });
      const dashboardPage = new Dashboard({ browser, page });
      const sidebar = await dashboardPage.getSidebar();
      await sidebar.toggleView("schemas");

      const schemasComponent = new Schemas({ browser, page: dashboardPage });
      const { dbSchema, schema, query } = await createTestSchema(variant);

      await schemasComponent.clickSchema(dbSchema);

      const response = await querySchema({ schema, query });

      if (variant.shouldError) {
        expect(response.errors).toBeDefined();
      } else {
        expect(response.errors).toBeUndefined();
      }

      await page.reload();
      await sleep(200);

      const traces = await client.trace.findMany({
        where: {
          schemaId: dbSchema.id,
        },
        includeSpans: true,
      });

      const tracesComponent = new Traces({ browser, page: dashboardPage });
      const uiTraces = await tracesComponent.getUITraces();
      expect(uiTraces.length).toEqual(1);

      const uiTrace = uiTraces[0];
      const trace = traces[0];
      const rootSpan = trace.spans.find((span) => span.isGraphQLRootSpan);

      expect(uiTrace).toBeDefined();
      expect(trace).toBeDefined();

      await tracesComponent.toggleFavouriteTrace({ traceId: uiTrace.id });
      await sidebar.toggleView("favourites");

      const favouritesComponent = new Favourites({
        browser,
        page: dashboardPage,
      });
      await favouritesComponent.assert();

      const [uiFavouriteTrace] = await favouritesComponent.getUITraces();

      if (rootSpan?.graphqlOperationName) {
        expect(uiTrace?.name).toBe(
          `${rootSpan?.graphqlOperationType} ${variant.randomFieldName}`,
        );
      } else {
        expect(uiTrace?.name).toEqual(rootSpan?.name);
      }

      expect(uiFavouriteTrace.name).toEqual(uiTrace.name);
      expect(uiFavouriteTrace.start).toEqual(`- ${uiTrace.start}`);

      await favouritesComponent.assertLink({ traceId: uiFavouriteTrace.id });

      await tracesComponent.toggleFavouriteTrace({ traceId: uiTrace.id });

      const newUiTraces = await favouritesComponent.getUITraces();
      expect(newUiTraces.length).toEqual(0);
    });
  }
});
