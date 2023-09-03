import { getBrowser, getPage, Browser } from './puppeteer';
import { IDS } from '@graphql-debugger/ui/src/testing';

describe('index', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should ?', async () => {
    const page = await getPage({ browser });

    await page.waitForSelector(`#${IDS.NO_SCHEMAS_FOUND}`);
    await page.waitForSelector(`#${IDS.LOGO}`);
    await page.close();

    expect(true).toBe(true);
  });
});
