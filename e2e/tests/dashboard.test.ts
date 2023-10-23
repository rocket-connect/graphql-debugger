import util from "util";

import { Dashboard } from "./pages/dashboard";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";

const sleep = util.promisify(setTimeout);

describe("dashboard", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should display the init dashboard without any errors", async () => {
    const page = await getPage({ browser });

    const dashboard = new Dashboard({
      browser,
      page,
    });

    await dashboard.init();

    await sleep(10000);
  });
});
