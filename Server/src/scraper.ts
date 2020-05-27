import puppeteer from "puppeteer";
import Data from "./Models/Data";

import LeagueParser from "./Parsers/LeagueParser";
import RuneterraParser from "./Parsers/RuneterraParser";
import ApexParser from "./Parsers/ApexParser";
import FortniteParser from "./Parsers/FortniteParser";
import ValorantParser from "./Parsers/ValorantParser";
import {
  OverwatchNewsParser,
  OverwatchArticleDateParser,
  OverwatchPatchParser,
} from "./Parsers/OverwatchParser";

// !Note: Apex Parser needs to be headful to work with shadow root.
async function requestPage(url: string, parser: () => Data[]) {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false,
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

// requestPage("https://na.leagueoflegends.com/en-us/news/game-updates/", LeagueParser);
// requestPage("https://playruneterra.com/en-us/news", RuneterraParser);
// requestPage("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
// requestPage("https://beta.playvalorant.com/en-us/news/", ValorantParser);
// requestPage("https://playoverwatch.com/en-us/news/patch-notes", OverwatchPatchParser);
// requestPage("https://playoverwatch.com/en-us/news", OverwatchNewsParser);

requestPage("https://www.ea.com/en-gb/games/apex-legends/news#news", ApexParser);
// https://playhearthstone.com/en-us/news
// https://www.epicgames.com/fortnite/en-US/news
