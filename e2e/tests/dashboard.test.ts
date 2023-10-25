import { Dashboard } from "./pages/dashboard";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";

describe("dashboard", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should display the init dashboard without any errors", async () => {
    const page = await getPage({ browser });

    const dashboard = new Dashboard({
      browser,
      page,
    });

    await dashboard.init();
  });
});
