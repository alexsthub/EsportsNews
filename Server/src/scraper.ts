import puppeteer from "puppeteer";
import Data from "./Models/Data";

import LeagueParser from "./Parsers/LeagueParser";
import RuneterraParser from "./Parsers/RuneterraParser";
import ApexParser from "./Parsers/ApexParser";
import FortniteParser from "./Parsers/FortniteParser";

async function requestPage(url: string, parser: () => Data[]) {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: true,
  });
  const page: puppeteer.Page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle2" });
  let data: Data[] = await page.evaluate(parser);
  console.log(data);
  // TODO: Do something with the data.
  debugger;

  await browser.close();
}

// requestPage("https://www.ea.com/en-gb/games/apex-legends/news#news", ApexParser);
// requestPage("https://na.leagueoflegends.com/en-us/news/game-updates/", LeagueParser);

// https://playhearthstone.com/en-us/news
// https://www.epicgames.com/fortnite/en-US/news
// requestPage("https://playruneterra.com/en-us/news", RuneterraParser);
// requestPage("https://playruneterra.com/en-us/news", RuneterraParser);
requestPage("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
