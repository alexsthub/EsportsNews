import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";
import Data from "../Models/Data";
import Scraper from "../Models/Scraper";

export default class OverwatchDetailsScraper implements Scraper {
  private url: string;
  private parser: () => any;
  private currentData: Data;
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
    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      headless: this.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });
    await page.goto(this.url, { waitUntil: "networkidle2" });
    let result = await page.evaluate(this.parser);
    await browser.close();
    this.currentData.rawDatetime = result;
    return [this.currentData];
  }
}
