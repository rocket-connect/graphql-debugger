import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";
import { Trace } from "./trace";

export class Traces extends BaseComponent {
  private trace: Trace;

  constructor({
    browser,
    page,
    trace,
  }: {
    browser: Browser;
    page: Page;
    trace: Trace;
  }) {
    super({ browser, page });
    this.trace = trace;
  }

  public async init() {
    const page = this.page?.page as PPage;

    const view = await page.waitForSelector(`#${IDS.trace_list.view}`);

    expect(view).toBeTruthy();
  }

  public async getUITraces(): Promise<
    { id: string; name: string; start: string }[]
  > {
    const page = this.page?.page as PPage;

    const table = await page.waitForSelector(`#${IDS.trace_list.table}`);
    if (!table) {
      throw new Error("Failed to find the traces table.");
    }

    const rows = await table.$$("tr[data-traceid]");
    const uiTraces = [];

    for (const row of rows) {
      const id = await row.evaluate((el) => el.getAttribute("data-traceid"));

      const nameCell = await row.$("th");

      const name = nameCell
        ? await page.evaluate((el) => el.innerText.trim(), nameCell)
        : null;

      const startCell = await row.$("td:last-child");

      const start = startCell
        ? await page.evaluate((el) => el.innerText.trim(), startCell)
        : null;

      if (id && name && start) {
        uiTraces.push({ id, name, start });
      }
    }

    return uiTraces;
  }

  public async clickTrace({
    schemaId,
    traceId,
  }: {
    schemaId: string;
    traceId: string;
  }) {
    const page = this.page?.page as PPage;

    const traceRow = await page.waitForSelector(
      `tr[data-traceid="${traceId}"]`,
    );
    if (!traceRow) {
      throw new Error(`Failed to find the trace with ID ${traceId}.`);
    }

    const linkElement = await traceRow.$("a");
    if (!linkElement) {
      throw new Error(`Failed to find the link for trace with ID ${traceId}.`);
    }

    await linkElement.click();

    const url = await page.url();
    expect(url).toContain(`/schema/${schemaId}/trace/${traceId}`);
  }
}