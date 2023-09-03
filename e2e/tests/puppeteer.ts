import path from 'path';
import fs from 'fs';
import puppeteer, { Browser, Page } from 'puppeteer';

const bundlePath = path.join(__dirname, '../node_modules/@graphql-debugger/ui/build/index.html');
let browser: Browser | null;
let bundle: string = '';

async function getBundle() {
  if (bundle) {
    return bundle;
  }

  bundle = (await fs.promises.readFile(bundlePath, 'utf-8')) as string;

  return bundle;
}

export async function getPage(options: { browser: Browser }): Promise<Page> {
  const bundle = await getBundle();

  const page = await options.browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.respond({ status: 200, contentType: 'text/html', body: bundle });
  });
  await page.goto('http://localhost');

  await page.waitForNetworkIdle();

  return page;
}

export async function getBrowser() {
  if (browser) {
    return browser;
  }

  browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: ['--disable-web-security'],
  });

  return browser;
}

export { Browser };
