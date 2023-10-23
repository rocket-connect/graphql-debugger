import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, Page as PPage } from "puppeteer";

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

    const loginIcon = await page.waitForSelector(`#${IDS.sidebar.icons.login}`);
    const npmIcon = await page.waitForSelector(`#${IDS.sidebar.icons.npm}`);

    const githubIcon = await page.waitForSelector(
      `#${IDS.sidebar.icons.github}`,
    );

    const infoIcon = await page.waitForSelector(`#${IDS.sidebar.icons.info}`);

    expect(sidebarIcons).toBeTruthy();
    expect(schemasIcon).toBeTruthy();
    expect(configIcon).toBeTruthy();
    expect(loginIcon).toBeTruthy();
    expect(npmIcon).toBeTruthy();
    expect(githubIcon).toBeTruthy();
    expect(infoIcon).toBeTruthy();

    // History is disabled by default
    await expect(
      page.waitForSelector(`#${IDS.sidebar.icons.history}`, {
        timeout: 500,
      }),
    ).rejects.toThrow();

    // Favourites is disabled by default
    await expect(
      page.waitForSelector(`#${IDS.sidebar.icons.favourites}`, {
        timeout: 500,
      }),
    ).rejects.toThrow();
  }
}
