import puppeteer from "puppeteer";
import Data from "../Models/Data";
import Scraper from "../Models/Scraper";

export default class OverwatchDetailsScraper implements Scraper {
  private url: string;
  private parser: () => Data;
  private currentData: any;
  private headless: boolean;

  constructor(url: string, parser: () => any, currentData: Data, headless = true) {
    this.url = url;
    this.parser = parser;
    this.currentData = currentData;
    this.headless = headless;
  }

  getUrl(): string {
    return this.url;
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
    let data = await page.evaluate(this.parser);
    await browser.close();
    return data;
  }
}
