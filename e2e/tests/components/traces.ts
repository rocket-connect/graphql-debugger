/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { sleep } from "../utils/sleep";
import { BaseComponent } from "./component";

export class Traces extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    const view = await page.$(`#${IDS.trace_list.view}`);

    expect(view).toBeTruthy();
  }

  public async getUITraces(): Promise<
    {
      id: string;
      name: string;
      start: string;
      duration: string;
      color: string;
    }[]
  > {
    const page = this.page?.page as PPage;

    const table = await page.$(`#${IDS.trace_list.table}`);
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

      const color = nameCell
        ? await page.evaluate((el) => {
            return el
              ? // @ts-ignore
                window.getComputedStyle(el).color
              : "";
          }, nameCell)
        : null;

      const durationCell = await row.$("td:nth-last-child(3)");

      const startCell = await row.$("td:nth-last-child(2)");

      const duration = durationCell
        ? await page.evaluate((el) => el.innerText.trim(), durationCell)
        : null;

      const start = startCell
        ? await page.evaluate((el) => el.innerText.trim(), startCell)
        : null;

      if (id && name && start && duration && color) {
        uiTraces.push({ id, name, start, duration, color });
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

    const traceRow = await page.$(`tr[data-traceid="${traceId}"]`);
    if (!traceRow) {
      throw new Error(`Failed to find the trace with ID ${traceId}.`);
    }

    const linkElement = await traceRow.$("a");
    if (!linkElement) {
      throw new Error(`Failed to find the link for trace with ID ${traceId}.`);
    }

    await linkElement.click();
    await sleep(200);

    const url = await page.url();
    expect(url).toContain(`/schema/${schemaId}/trace/${traceId}`);
  }

  public async toggleFavouriteTrace({ traceId }: { traceId: string }) {
    const page = this.page?.page as PPage;

    const traceRow = await page.$(`tr[data-traceid="${traceId}"]`);

    if (!traceRow) {
      throw new Error(`Failed to find the trace with ID ${traceId}.`);
    }

    const buttonElement = await traceRow.$("button");
    if (!buttonElement) {
      throw new Error(
        `Failed to find the button for trace with ID ${traceId}.`,
      );
    }

    await buttonElement.click();
  }
}
