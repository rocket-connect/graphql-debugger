/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class TraceViewer extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    const view = await page.$(`#${IDS.trace_viewer.view}`);
    const expand = await page.$(`#${IDS.trace_viewer.expand}`);

    expect(view).toBeTruthy();
    expect(expand).toBeTruthy();
  }

  public async getSpans(): Promise<
    { name: string; time: string; color: string }[]
  > {
    const page = this.page?.page as PPage;

    const view = await page.$(`#${IDS.trace_viewer.view}`);
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
}
