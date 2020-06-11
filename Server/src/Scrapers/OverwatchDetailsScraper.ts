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
    let result = null;
    let browser = null;
    try {
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: this.headless,
        defaultViewport: chromium.defaultViewport,
        ignoreHTTPSErrors: true,
      });
      const page = await browser.newPage();
      await page.goto(this.url, { waitUntil: "networkidle2" });
      result = await page.evaluate(this.parser);
      this.currentData.rawDatetime = result;
    } catch (error) {
      console.log(error);
    } finally {
      if (browser !== null) {
        await browser.close();
      }
    }
    return [this.currentData];
  }
}
