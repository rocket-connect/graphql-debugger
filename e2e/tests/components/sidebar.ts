import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, ElementHandle, Page as PPage } from "puppeteer";

import { Page } from "../pages/page";
import { BaseComponent } from "./component";

export class Sidebar extends BaseComponent {
  constructor({ browser, page }: { browser: Browser; page: Page }) {
    super({ browser, page });
  }

  public async init() {
    const page = this.page?.page as PPage;

    const sidebarIcons = await page.waitForSelector(
      `#${IDS.sidebar.icons.view}`,
    );

    const schemasIcon = await page.waitForSelector(
      `#${IDS.sidebar.icons.schemas}`,
    );

    const configIcon = await page.waitForSelector(
      `#${IDS.sidebar.icons.config}`,
    );

    const historyIcon = await page.waitForSelector(
      `#${IDS.sidebar.icons.history}`,
    );

    const favouritesIcon = await page.waitForSelector(
      `#${IDS.sidebar.icons.favourites}`,
    );

    const loginIcon = await page.waitForSelector(`#${IDS.sidebar.icons.login}`);

    const npmIcon = await page.waitForSelector(`#${IDS.sidebar.icons.npm}`);

    const githubIcon = await page.waitForSelector(
      `#${IDS.sidebar.icons.github}`,
    );

    const infoIcon = await page.waitForSelector(`#${IDS.sidebar.icons.info}`);

    expect(sidebarIcons).toBeTruthy();
    expect(schemasIcon).toBeTruthy();
    expect(configIcon).toBeTruthy();
    expect(historyIcon).toBeTruthy();
    expect(favouritesIcon).toBeTruthy();
    expect(loginIcon).toBeTruthy();
    expect(npmIcon).toBeTruthy();
    expect(githubIcon).toBeTruthy();
    expect(infoIcon).toBeTruthy();
  }

  public async getView(
    key: keyof typeof IDS.sidebar.views,
  ): Promise<ElementHandle<Element> | null> {
    const page = this.page?.page as PPage;

    const id = IDS.sidebar.views[key];

    let view: ElementHandle<Element> | null = null;
    try {
      view = await page.waitForSelector(`#${id}`, {
        timeout: 10000,
      });
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

    const infoIcon = await page.waitForSelector(`#${id}`);
    await infoIcon?.click();

    const view = await this.getView(key);

    return view;
  }
}
