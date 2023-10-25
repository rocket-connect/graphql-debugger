import { TraceGroup } from "@graphql-debugger/data-access";
import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Trace extends BaseComponent {
  private dbTraceGroup: TraceGroup;

  constructor({
    browser,
    page,
    dbTraceGroup,
  }: {
    browser: Browser;
    page: Page;
    dbTraceGroup: TraceGroup;
  }) {
    super({ browser, page });
    this.dbTraceGroup = dbTraceGroup;
  }

  public async init() {
    const page = this.page?.page as PPage;

    const view = await page.waitForSelector(`#${IDS.trace.view}`);
    const header = await page.waitForSelector(`#${IDS.trace.header}`);
    const editor = await page.waitForSelector(`#${IDS.trace.editor}`);
    const query = await page.waitForSelector(`#${IDS.trace.query}`);

    expect(view).toBeTruthy();
    expect(header).toBeTruthy();
    expect(editor).toBeTruthy();
    expect(query).toBeTruthy();
  }
}
