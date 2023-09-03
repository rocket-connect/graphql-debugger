import { UI_PORT } from '@graphql-debugger/collector-proxy';
import { prisma } from './prisma';
import { getBrowser, getPage, Browser } from './puppeteer';
import { IDS } from '@graphql-debugger/ui/src/testing';
import util from 'util';

const sleep = util.promisify(setTimeout);

describe('schema', () => {
  let browser: Browser;

  beforeAll(async () => {
    browser = await getBrowser();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should fetch and display the schema', async () => {
    const schemas = await prisma.schema.count();
    expect(schemas).toBe(0);

    const schema = await prisma.schema.create({
      data: {
        hash: 'hash',
        typeDefs: `
                type Query {
                    hello: String
                }
            `,
      },
    });

    await sleep(1000);

    const page = await getPage({ browser });

    await page.goto(`http://localhost:${UI_PORT}/#/schema/${schema.id}`);

    await page.waitForNetworkIdle();

    await page.waitForSelector(`#${IDS.SCHEMA}`);
    const dataValues = await page.$$eval(`#${IDS.SCHEMA}`, (divs) =>
      divs.map((div) => div.dataset.schema)
    );

    expect(dataValues).toHaveLength(1);
    expect(dataValues[0]).toBe(schema.id);

    await page.close();
  });
});
