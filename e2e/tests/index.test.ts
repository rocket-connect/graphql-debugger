import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, getBrowser, getPage } from "./puppeteer";

describe("index", () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("should display no schemas found and logo when there are no", async () => {
    const page = await getPage({ browser });

    await page.waitForSelector(`#${IDS.NO_SCHEMAS_FOUND}`);
    await page.waitForSelector(`#${IDS.LOGO}`);
    await page.close();

    expect(true).toBe(true);
  });
});
