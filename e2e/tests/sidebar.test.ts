import { IDS } from "@graphql-debugger/ui/src/testing";

import util from "util";

import { Sidebar } from "./components/sidebar";
import { Dashboard } from "./pages/dashboard";
import { Browser, getBrowser, getPage } from "./utils/puppeteer";

const sleep = util.promisify(setTimeout);

describe("sidebar", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
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

    const defaultHiddenViews = ["history", "favourites"];
    const sidebarViews = (
      Object.keys(IDS.sidebar.views) as (keyof typeof IDS.sidebar.views)[]
    ).filter((key) => !defaultHiddenViews.includes(key));

    for await (const key of sidebarViews) {
      // Show the view
      let view = await sidebar.toggleView(key);
      expect(view).toBeTruthy();

      await sleep(200);

      // Refresh the page
      await page.reload({
        waitUntil: ["networkidle0", "domcontentloaded"],
      });

      // Expect the view to be visible
      view = await sidebar.getView(key);
      expect(view).toBeTruthy();

      // Close the view
      view = await sidebar.toggleView(key);
      expect(await view?.isHidden()).toBeFalsy();

      // Refresh the page
      await page.reload({
        waitUntil: ["networkidle0", "domcontentloaded"],
      });

      // Expect the view to still be hidden
      view = await sidebar.getView(key);
      expect(await view?.isHidden()).toBeFalsy();
    }
  });
});
