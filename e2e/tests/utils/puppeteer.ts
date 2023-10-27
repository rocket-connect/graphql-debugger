import { BACKEND_PORT } from "@graphql-debugger/backend";

import puppeteer, { Browser, Page } from "puppeteer";

export { Browser } from "puppeteer";

export async function getPage(options: { browser: Browser }): Promise<Page> {
  const page = await options.browser.newPage();

  await page.goto(`http://localhost:${BACKEND_PORT}`);

  return page;
}

export async function getBrowser() {
  const browser = await puppeteer.launch({
    // headless: false,
    headless: process.env.HEADLESS ? "new" : false,
    defaultViewport: null,
    args: ["--disable-web-security"],
    protocolTimeout: 600000,
    timeout: 600000,
  });

  return browser;
}
