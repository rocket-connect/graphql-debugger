import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Trace extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async init() {
    const page = this.page?.page as PPage;

    const view = await page.waitForSelector(`#${IDS.trace.view}`);
    const header = await page.waitForSelector(`#${IDS.trace.header}`);
    const editor = await page.waitForSelector(`#${IDS.trace.editor}`);
    const pill = await page.waitForSelector(`#${IDS.trace.pill}`);
    const trace_viewer = await page.waitForSelector(
      `#${IDS.trace_viewer.view}`,
    );
    const trace_viewer_not_found = await page.waitForSelector(
      `#${IDS.trace_viewer.not_found}`,
    );

    expect(view).toBeTruthy();
    expect(header).toBeTruthy();
    expect(editor).toBeTruthy();
    expect(pill).toBeTruthy();
    expect(trace_viewer).toBeTruthy();
    expect(trace_viewer_not_found).toBeTruthy();

    //  No trace found so query is hidden
    await expect(
      page.waitForSelector(`#${IDS.trace.query}`, {
        timeout: 500,
      }),
    ).rejects.toThrow();
  }
}
