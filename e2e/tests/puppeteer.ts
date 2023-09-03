import { UI_PORT } from '@graphql-debugger/collector-proxy';
import puppeteer, { Browser, Page } from 'puppeteer';
export { Browser } from 'puppeteer';

let browser: Browser | null;

export async function getPage(options: { browser: Browser }): Promise<Page> {
  const page = await options.browser.newPage();

  await page.goto(`http://localhost:${UI_PORT}`);

  return page;
}

export async function getBrowser() {
  if (browser) {
    return browser;
  }

  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--disable-web-security'],
  });

  return browser;
}
