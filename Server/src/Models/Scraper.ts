import puppeteer from "puppeteer";
import Data from "./Data";

// TODO: Why are all the dates [object, object]?
export default class GenericScraper {
  private url: string;
  private parser: () => Data[];
  private headless: boolean;

  constructor(url: string, parser: () => Data[], headless = true) {
    this.url = url;
    this.parser = parser;
    this.headless = headless;
  }

  async scrape() {
    const browser: puppeteer.Browser = await puppeteer.launch({
      headless: this.headless,
    });
    const page: puppeteer.Page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(this.url, { waitUntil: "networkidle2" });
    let data: Data[] = await page.evaluate(this.parser);
    await browser.close();
    return data;
  }
}
