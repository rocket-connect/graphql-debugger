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
    await schemasComponent.assert();
  });

  test("should display a list of schemas", async () => {
    const { dbSchema: schema1 } = await createTestSchema();
    const { dbSchema: schema2 } = await createTestSchema();
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
    expect(uiSchemas.length).toEqual(2);

    const uiSchema1 = uiSchemas.find((uiSchema) => uiSchema.id === schema1.id);
    expect(uiSchema1).toBeTruthy();
    expect(uiSchema1?.typeDefs).toEqual(schema1.typeDefs);

    const uiSchema2 = uiSchemas.find((uiSchema) => uiSchema.id === schema2.id);
    expect(uiSchema2).toBeTruthy();
    expect(uiSchema2?.typeDefs).toEqual(schema2.typeDefs);
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
