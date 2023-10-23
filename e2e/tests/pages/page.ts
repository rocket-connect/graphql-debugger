import { Browser, Page as PPage } from "puppeteer";

import { getPage } from "../utils/puppeteer";

export abstract class Page {
  protected browser: Browser;
  public page?: PPage;

  constructor({ browser, page }: { browser: Browser; page?: PPage }) {
    if (page) {
      this.page = page;
    }

    this.browser = browser;
  }

  public async load() {
    this.page = this.page || (await getPage({ browser: this.browser }));
  }

  public async close() {
    await this?.page?.close();
  }

  public async getURL() {
    return this?.page?.url();
  }
}
