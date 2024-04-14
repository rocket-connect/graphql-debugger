import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, ElementHandle, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Sidebar extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async assert() {
    const page = this.page?.page as PPage;

    await Promise.all(
      Object.entries(IDS.sidebar.icons).map(async ([key, id]) => {
        try {
          const icon = await page.$(`#${id}`);
          expect(icon).toBeTruthy();
        } catch (e) {
          throw new Error(`Failed to find the ${key} icon.`);
        }
      }),
    );
  }

  public async getView(
    key: keyof typeof IDS.sidebar.views,
  ): Promise<ElementHandle<Element> | null> {
    const page = this.page?.page as PPage;

    const id = IDS.sidebar.views[key];

    let view: ElementHandle<Element> | null = null;
    try {
      view = await page.$(`#${id}`);
    } catch (e) {
      // Ignore
    }

    return view;
  }

  public async toggleView(
    key: keyof typeof IDS.sidebar.views,
  ): Promise<ElementHandle<Element> | null> {
    const page = this.page?.page as PPage;

    const id = IDS.sidebar.icons[key];

    const icon = await page.$(`#${id}`);
    await icon?.click();

    const view = await this.getView(key);

    return view;
  }
}
