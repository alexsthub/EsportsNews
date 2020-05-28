import puppeteer from "puppeteer";
import Data from "./Data";

// requestPage("https://na.leagueoflegends.com/en-us/news/game-updates/", LeagueParser);
// requestPage("https://playruneterra.com/en-us/news", RuneterraParser);
// requestPage("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
// requestPage("https://beta.playvalorant.com/en-us/news/", ValorantParser);
// requestPage("https://www.ea.com/en-gb/games/apex-legends/news#news", ApexParser);
// requestPage("https://blog.counter-strike.net/", CounterStrikeParser);
// requestPage("https://blog.counter-strike.net/index.php/category/updates/", CounterStrikeParser);
// requestPage("https://playhearthstone.com/en-us/news", HearthstoneParser);

// requestPage("https://playoverwatch.com/en-us/news/patch-notes", OverwatchPatchParser);
// requestPage("https://playoverwatch.com/en-us/news", OverwatchNewsParser);

// !Note: Apex Parser needs to be headful to work with shadow root.
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
    console.log(data);
    // TODO: Do something with the data.
    debugger;

    await browser.close();
  }
}
