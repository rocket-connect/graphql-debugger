import { IDS } from "@graphql-debugger/ui/src/testing";

import { Sidebar } from "./components/sidebar";
import { Dashboard } from "./pages/dashboard";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";

describe("sidebar", () => {
  let browser: Browser;

  beforeEach(async () => {
    browser = await getBrowser();
  });

  afterEach(async () => {
    await browser.close();
  });

  test("should display the init sidebar without any errors", async () => {
    const page = await getPage({ browser });

    const dashboard = new Dashboard({
      browser,
      page,
    });
    await dashboard.init();

    const sidebar = new Sidebar({
      browser,
      page: dashboard,
    });
    await sidebar.init();

    const sidebarViews = Object.keys(
      IDS.sidebar.views,
    ) as (keyof typeof IDS.sidebar.views)[];

    for await (const key of sidebarViews) {
      let view = await sidebar.toggleView(key);
      expect(view).toBeTruthy();

      await page.reload({
        waitUntil: ["networkidle0", "domcontentloaded"],
      });

      view = await sidebar.getView(key);
      expect(view).toBeTruthy();

      view = await sidebar.toggleView(key);
      expect(await view?.isHidden()).toBeFalsy();

      await page.reload({
        waitUntil: ["networkidle0", "domcontentloaded"],
      });

      view = await sidebar.getView(key);
      expect(await view?.isHidden()).toBeFalsy();
    }
  });
});
