/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Favourites extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    const view = await page.waitForSelector(`#${IDS.sidebar.views.favourites}`);

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

    const view = await page.waitForSelector(`#${IDS.sidebar.views.favourites}`);
    if (!view) {
      throw new Error("Failed to find the favourites view.");
    }

    const rows = await view.$$("div");
    const uiTraces = [];

    for (const row of rows) {
      const id = await row.evaluate((el) =>
        el.getAttribute("data-favouritestraceid"),
      );

      const nameCell = await row.$("a");

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

      const startCell = await row.$("p");

      const durationCell = await row.$("div:nth-child(2) > span");

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

    expect(view).toBeTruthy();

    return uiTraces;
  }

  public async assertLink({ traceId }: { traceId: string }) {
    const page = this.page?.page as PPage;

    const traceRow = await page.waitForSelector(
      `div[data-favouritestraceid="${traceId}"]`,
    );
    if (!traceRow) {
      throw new Error(`Failed to find the trace with ID ${traceId}.`);
    }

    const linkElement = await traceRow.$("a");
    if (!linkElement) {
      throw new Error(`Failed to find the link for trace with ID ${traceId}.`);
    }
  }
}
