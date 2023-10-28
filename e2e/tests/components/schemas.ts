/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Schema as PSchema } from "@graphql-debugger/data-access";
import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Schemas extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    const schemasView = await page.$(`#${IDS.sidebar.views.schemas}`);

    const getting_started = await page.$(`#${IDS.getting_started.view}`);

    expect(schemasView).toBeTruthy();
    expect(getting_started).toBeTruthy();
  }

  public async getUISchemas(): Promise<{ id: string; typeDefs: string }[]> {
    const page = this.page?.page as PPage;

    await page.waitForSelector(`#${IDS.sidebar.views.schemas}`);

    const uiSchemas = await page.$$eval(
      `#${IDS.sidebar.views.schemas} li`,
      (liElements) =>
        liElements.map((li) => ({
          id: li.getAttribute("data-schemalistid") || "",
          typeDefs: li.getAttribute("data-typedefs") || "",
        })),
    );

    return uiSchemas;
  }

  public async clickSchema(dbSchema: PSchema) {
    const page = this.page?.page as PPage;

    await page.waitForSelector(`#${IDS.sidebar.views.schemas}`);

    const schemaSelector = `[data-schemalistid*="${dbSchema.id}"]`;
    const schema = await page.waitForSelector(schemaSelector);
    if (!schema) {
      throw new Error(`Failed to find schema with selector: ${schemaSelector}`);
    }
    await schema?.click();

    const url = await page.url();
    expect(url).toContain(`/schema/${dbSchema.id}`);

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

    expect(renderedSchema.id).toBe(dbSchema.id);
    expect(renderedSchema.typeDefs).toBe(dbSchema.typeDefs);
  }
}
