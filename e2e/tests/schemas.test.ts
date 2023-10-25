import { Schemas } from "./components/schemas";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";

describe("schemas", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should display the getting started view if no schemas are found", async () => {
    const page = await getPage({ browser });

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
    await schemasComponent.init();
  });

  test("should display a list of schemas", async () => {
    const { dbSchema } = await createTestSchema();
    const page = await getPage({ browser });

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

    const uiSchemas = await schemasComponent.getUISchemas();
    expect(uiSchemas.length).toEqual(1);

    const [uiSchema] = uiSchemas;
    expect(uiSchema.id).toEqual(dbSchema.id);
    expect(uiSchema.typeDefs).toEqual(dbSchema.typeDefs);
  });

  test("should open and display a schema", async () => {
    const { dbSchema } = await createTestSchema();
    const page = await getPage({ browser });

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
  });
});
