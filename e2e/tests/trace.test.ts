import { Schema } from "./components/schema";
import { Trace } from "./components/trace";
import { Dashboard } from "./pages/dashboard";
import { createTestSchema } from "./utils/create-test-schema";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";

describe("trace", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should load the inital trace view", async () => {
    const page = await getPage({ browser });
    const { dbSchema } = await createTestSchema();

    const dashboardPage = new Dashboard({
      browser,
      page,
    });
    await dashboardPage.init();

    const sidebar = await dashboardPage.getSidebar();
    await sidebar.toggleView("schemas");

    const schemaComponent = new Schema({
      browser,
      page: dashboardPage,
      dbSchema,
    });
    await schemaComponent.init();

    const traceComponent = new Trace({
      browser,
      page: dashboardPage,
    });
    await traceComponent.init();
  });
});
