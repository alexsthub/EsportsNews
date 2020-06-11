import chromium from "chrome-aws-lambda";
import Data from "../Models/Data";
import Scraper from "../Models/Scraper";

export default class GenericScraper implements Scraper {
  private url: string;
  private parser: () => Data[];
  private headless: boolean;

  constructor(url: string, parser: () => Data[], headless = true) {
    this.url = url;
    this.parser = parser;
    this.headless = headless;
  }

  getUrl(): string {
    return this.url;
  }

  async scrape(): Promise<Data[]> {
    console.log("Entering scrape call");
    let browser = null;
    let result = null;
    try {
      console.log("Opening browser");
      browser = await chromium.puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath,
        headless: this.headless,
        defaultViewport: chromium.defaultViewport,
        ignoreHTTPSErrors: true,
      });
      console.log("Launched");
      const page = await browser.newPage();
      console.log("Created new page");
      await page.goto(this.url, { waitUntil: "networkidle2" });
      console.log("Arrived at new page");
      result = await page.evaluate(this.parser);
      console.log("Evaluated page! THIS IS GOOD NEWS");
    } catch (error) {
      console.log(error);
    } finally {
      if (browser !== null) {
        console.log("Closing browser");
        await browser.close();
      }
    }
    return result;
  }
}
