import puppeteer from "puppeteer";
import Data from "./Models/Data";

import LeagueParser from "./Parsers/LeagueParser";
import ApexParser from "./Parsers/ApexParser";

async function requestPage(url: string) {
  const browser: puppeteer.Browser = await puppeteer.launch({ headless: true });
  const page: puppeteer.Page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });
  await page.goto(url, { waitUntil: "networkidle2" });
  let data: Data[] = await page.evaluate(LeagueParser);
  console.log(data);
  // TODO: Do something with the data.
  debugger;

  await browser.close();
}

// requestPage("https://www.ea.com/en-gb/games/apex-legends/news#news");
requestPage("https://na.leagueoflegends.com/en-us/news/game-updates/");
