/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IDS } from "@graphql-debugger/ui/src/testing";

import { Browser, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Trace extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    const view = await page.$(`#${IDS.trace.view}`);
    const header = await page.$(`#${IDS.trace.header}`);
    const query = await page.$(`#${IDS.trace.query}`);
    const editor = await page.$(`#${IDS.trace.editor}`);
    const pill = await page.$(`#${IDS.trace.pill}`);
    const trace_viewer = await page.$(`#${IDS.trace_viewer.view}`);
    const trace_viewer_not_found = await page.$(
      `#${IDS.trace_viewer.not_found}`,
    );

    expect(view).toBeTruthy();
    expect(header).toBeTruthy();
    expect(editor).toBeTruthy();
    expect(pill).toBeTruthy();
    expect(trace_viewer).toBeTruthy();
    expect(trace_viewer_not_found).toBeTruthy();

    // No trace selected at first
    expect(query).toBeFalsy;
  }

  public async getPill(): Promise<{
    name: string;
    duration: string;
    start: string;
    color: string;
  }> {
    const page = this.page?.page as PPage;

    const pill = await page.$(`#${IDS.trace.pill}`);
    if (!pill) {
      throw new Error("Failed to find the trace pill.");
    }

    const nameDuration = await page.evaluate((el) => {
      // @ts-ignore
      return el.querySelector("p:nth-child(1)")?.innerText;
    }, pill);

    if (!nameDuration) {
      throw new Error("Failed to find the trace name and duration.");
    }

    const [name, duration] = nameDuration.split(" - ");

    const start = await page.evaluate((el) => {
      // @ts-ignore
      return el.querySelector("p:nth-child(2)")?.innerText;
    }, pill);

    if (!start) {
      throw new Error("Failed to find the trace start.");
    }

    const bg = await page.evaluate((el) => {
      // @ts-ignore
      const element = el.querySelector("span");

      return element
        ? // @ts-ignore
          window.getComputedStyle(element).color
        : "";
    }, pill);

    return {
      name,
      duration,
      start,
      color: bg,
    };
  }

  public async getEditorValues({
    includeError,
  }: {
    includeError?: boolean;
  }): Promise<{
    query: string;
    variables?: string;
    result?: string;
    error?: string;
  }> {
    const page = this.page?.page as PPage;

    await page.$(`#${IDS.trace.editor}`);
    const query = await page.$(`#${IDS.trace.query}`);

    const renderedQuery = await page.evaluate((el) => {
      // @ts-ignore
      return el.querySelector("pre")?.innerText;
    }, query);

    const variables = await page.$(`#${IDS.trace.variables}`);
    if (!variables) {
      throw new Error("Failed to find the variables.");
    }

    const links = await variables.$$("a");
    const map = new Map<string, string>();
    const excluded = ["Context"];

    if (includeError) {
      excluded.push("Result");
    } else {
      excluded.push("Errors");
    }

    for await (const link of links) {
      const text = await page.evaluate((el) => {
        // @ts-ignore
        return el.innerText;
      }, link);

      if (excluded.includes(text)) {
        continue;
      }

      await link.click();

      const json_viewer = await page.$(`#${IDS.trace.json_viewer}`);

      const json_text = await page.evaluate((el) => {
        // @ts-ignore
        return el.innerText;
      }, json_viewer);

      map.set(text, json_text);
    }

    return {
      query: renderedQuery || "",
      variables: map.get("Variables"),
      result: map.get("Result"),
      error: map.get("Errors"),
    };
  }
}
