import { Browser } from "puppeteer";

import { Page } from "../pages/page";

export abstract class BaseComponent {
  protected browser: Browser;
  public page: Page;

  constructor({ browser, page }: { browser: Browser; page: Page }) {
    this.page = page;
    this.browser = browser;
  }
}
