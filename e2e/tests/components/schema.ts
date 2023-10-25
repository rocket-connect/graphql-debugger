/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Schema as PSchema } from "@graphql-debugger/data-access";
import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Schema extends BaseComponent {
  private dbSchema: PSchema;

  constructor({
    browser,
    page,
    dbSchema,
  }: {
    browser: Browser;
    page: Page;
    dbSchema: PSchema;
  }) {
    super({ browser, page });
    this.dbSchema = dbSchema;
  }

  public async init() {
    const page = this.page?.page as PPage;

    await page.waitForSelector(`#${IDS.sidebar.views.schemas}`);

    const schemaSelector = `[data-schemaid*="${this.dbSchema.id}"]`;
    await page.waitForSelector(schemaSelector);
    await page.click(schemaSelector);

    await page.waitForSelector(`#${IDS.schema.render}`);

    const [renderedSchema] = await page.$$eval(
      `#${IDS.schema.render}`,
      (divs) =>
        divs.map((div) => ({
          // @ts-ignore
          id: div.dataset.schemaid,
          // @ts-ignore
          typeDefs: div.dataset.typedefs,
        })),
    );

    expect(renderedSchema.id).toBe(this.dbSchema.id);
    expect(renderedSchema.typeDefs).toBe(this.dbSchema.typeDefs);
  }
}
