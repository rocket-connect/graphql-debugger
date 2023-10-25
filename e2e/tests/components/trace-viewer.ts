/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";
import { Trace } from "./trace";

export class TraceViewer extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async init() {
    const page = this.page?.page as PPage;

    const view = await page.waitForSelector(`#${IDS.trace_viewer.view}`);
    const expand = await page.waitForSelector(`#${IDS.trace_viewer.expand}`);

    expect(view).toBeTruthy();
    expect(expand).toBeTruthy();
  }

  public async expand() {
    const page = this.page?.page as PPage;

    const expand = await page.waitForSelector(`#${IDS.trace_viewer.expand}`);
    if (!expand) {
      throw new Error("Failed to find the trace viewer expand button.");
    }

    await expand.click();
  }

  public async close() {
    const page = this.page?.page as PPage;

    const close = await page.waitForSelector(`#${IDS.modal.close}`);
    if (!close) {
      throw new Error("Failed to find the trace viewer close button.");
    }

    await close.click();
  }

  public async getSpans(): Promise<
    { name: string; time: string; color: string }[]
  > {
    const page = this.page?.page as PPage;

    const view = await page.waitForSelector(`#${IDS.trace_viewer.full_screen}`);
    if (!view) {
      throw new Error("Failed to find the trace viewer view.");
    }

    const uiSpans: { name: string; time: string; color: string }[] =
      await view.$$eval("div[data-trace-view-spanid]", (spans) => {
        return spans.map((span) => {
          const nameElem = span.querySelector('[data-name="span-name"]');
          const timeElem = span.querySelector('[data-time="span-time"]');
          const lineElement = span.querySelector('[data-line="span-line"]');

          return {
            name: nameElem ? nameElem.textContent || "" : "",
            time: timeElem ? timeElem.textContent : "",
            color: lineElement
              ? // @ts-ignore
                window.getComputedStyle(lineElement).backgroundColor
              : "",
          };
        });
      });

    return uiSpans;
  }

  public async getPill() {
    const traceComponent = new Trace({
      browser: this.browser,
      page: this.page,
    });
    const pill = await traceComponent.getPill();

    return pill;
  }
}
