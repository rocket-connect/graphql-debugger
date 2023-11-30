/* eslint-disable @typescript-eslint/ban-ts-comment */
import { BACKEND_PORT } from "@graphql-debugger/backend";

import puppeteer, { Browser, Page } from "puppeteer";

export { Browser } from "puppeteer";

export async function getPage(options: { browser: Browser }): Promise<Page> {
  const page = await options.browser.newPage();

  await page.evaluateOnNewDocument(
    (theme) => {
      // @ts-ignore
      localStorage.setItem("theme", theme);
    },
    // TODO - test dark mode https://github.com/rocket-connect/graphql-debugger/issues/151
    JSON.stringify({ state: { theme: "light" }, version: 0 }),
  );

  await page.goto(`http://localhost:${BACKEND_PORT}`, {
    waitUntil: "load",
  });

  return page;
}

export async function getBrowser() {
  const browser = await puppeteer.launch({
    headless: process.env.HEADLESS ? false : "new",
    defaultViewport: null,
    args: ["--disable-web-security"],
    protocolTimeout: 600000,
    timeout: 600000,
    slowMo: process.env.SLOW_MO ? Number(process.env.SLOW_MO) : 50,
  });

  return browser;
}
