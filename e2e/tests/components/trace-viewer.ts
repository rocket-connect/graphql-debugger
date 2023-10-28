/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { sleep } from "../utils/sleep";
import { BaseComponent } from "./component";
import { Trace } from "./trace";

export class TraceViewer extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    const view = await page.$(`#${IDS.trace_viewer.view}`);
    const dView = await page.$(`#${IDS.trace_viewer.default}`);
    const expand = await page.$(`#${IDS.trace_viewer.expand}`);

    expect(view).toBeTruthy();
    expect(dView).toBeTruthy();
    expect(expand).toBeTruthy();
  }

  public async expand() {
    const page = this.page?.page as PPage;

    const expand = await page.$(`#${IDS.trace_viewer.expand}`);
    if (!expand) {
      throw new Error("Failed to find the trace viewer expand button.");
    }

    await expand.click();

    await sleep(200);

    const view = await page.$(`#${IDS.trace_viewer.full_screen}`);
    if (!view) {
      throw new Error("Failed to find the full screen viewer view.");
    }
  }

  public async getSpans({
    isExpanded,
  }: {
    isExpanded?: boolean;
  }): Promise<{ name: string; time: string; color: string }[]> {
    const page = this.page?.page as PPage;

    const view = await page.$(
      `#${
        isExpanded ? IDS.trace_viewer.full_screen : IDS.trace_viewer.default
      }`,
    );
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
