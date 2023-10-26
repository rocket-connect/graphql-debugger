import { IDS } from "@graphql-debugger/ui/src/testing";

import { expect } from "@jest/globals";
import { Browser, Page as PPage } from "puppeteer";

import { Sidebar } from "../components/sidebar";
import { Page } from "./page";

export class Dashboard extends Page {
  constructor({ browser, page }: { browser: Browser; page?: PPage }) {
    super({ browser, page });
  }

  public async init() {
    const page = this.page as PPage;

    const pageComponent = await page.waitForSelector(`#${IDS.dashboard.page}`);
    const logoComponent = await page.waitForSelector(`#${IDS.dashboard.logo}`);

    const sidebarIcons = await page.waitForSelector(
      `#${IDS.sidebar.icons.view}`,
    );

    expect(pageComponent).toBeTruthy();
    expect(logoComponent).toBeTruthy();
    expect(sidebarIcons).toBeTruthy();

    // Sidebar view is hidden by default
    await expect(
      page.waitForSelector(`#${IDS.sidebar.view}`, {
        timeout: 10000,
      }),
    ).rejects.toThrow();

    const sidebar = new Sidebar({ browser: this.browser, page: this });
    await sidebar.init();
  }

  public async getSidebar(): Promise<Sidebar> {
    const sidebar = new Sidebar({ browser: this.browser, page: this });
    await sidebar.init();

    return sidebar;
  }
}
