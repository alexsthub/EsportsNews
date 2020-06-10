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
    const browser = await chromium.puppeteer.launch({
      executablePath: await chromium.executablePath,
      headless: this.headless,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(this.url, { waitUntil: "networkidle2" });
    let data: Data[] = await page.evaluate(this.parser);
    await browser.close();
    return data;
  }
}
