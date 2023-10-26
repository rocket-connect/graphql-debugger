import util from "util";

import { Favourites } from "./components/favourites";
import { Schemas } from "./components/schemas";
import { Trace } from "./components/trace";
import { Traces } from "./components/traces";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";
import { querySchema } from "./utils/query-schema";

const sleep = util.promisify(setTimeout);

describe("favourites", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should add traces to favourites and remove them", async () => {
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

    const tracesComponent = new Traces({
      browser,
      page: dashboardPage,
    });
    await tracesComponent.init();

    const uiTraces = await tracesComponent.getUITraces();
    expect(uiTraces.length).toEqual(2);

    const uiTrace1 = uiTraces[0];
    const uiTrace2 = uiTraces[1];

    await tracesComponent.toggleFavouriteTrace({
      traceId: uiTrace1.id,
    });
    await tracesComponent.toggleFavouriteTrace({
      traceId: uiTrace2.id,
    });

    await sidebar.toggleView("favourites");

    const favouritesComponent = new Favourites({
      browser,
      page: dashboardPage,
    });
    await favouritesComponent.init();

    const [uiFavouriteTrace1, uiFavouriteTrace2] =
      await favouritesComponent.getUITraces();

    expect(uiFavouriteTrace2.name).toEqual(uiTrace1.name);
    expect(uiFavouriteTrace2.start).toEqual(`- ${uiTrace1.start}`);

    expect(uiFavouriteTrace1.name).toEqual(uiTrace2.name);
    expect(uiFavouriteTrace1.start).toEqual(`- ${uiTrace2.start}`);

    await favouritesComponent.assertLink({
      traceId: uiFavouriteTrace1.id,
    });
    await favouritesComponent.assertLink({
      traceId: uiFavouriteTrace2.id,
    });

    await tracesComponent.toggleFavouriteTrace({
      traceId: uiTrace1.id,
    });
    await tracesComponent.toggleFavouriteTrace({
      traceId: uiTrace2.id,
    });

    const newUiTraces = await favouritesComponent.getUITraces();
    expect(newUiTraces.length).toEqual(0);
  });
});
