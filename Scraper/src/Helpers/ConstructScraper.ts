import LeagueParser from "../Parsers/LeagueParser";
import RuneterraParser from "../Parsers/RuneterraParser";
import ApexParser from "../Parsers/ApexParser";
import FortniteParser from "../Parsers/FortniteParser";
import ValorantParser from "../Parsers/ValorantParser";
import {
  OverwatchNewsParser,
  OverwatchArticleDateParser,
  OverwatchPatchParser,
} from "../Parsers/OverwatchParser";
import CounterStrikeParser from "../Parsers/CounterStrikeParser";
import HearthstoneParser from "../Parsers/HearthstoneParser";
import TFTParser from "../Parsers/TFTParser";

import GenericScraper from "../Scrapers/GenericScraper";
import OverwatchDetailsScraper from "../Scrapers/OverwatchDetailsScraper";
import Request from "../Models/Request";
import Scraper from "../Models/Scraper";

export default function constructScraper(request: Request): Scraper {
  let scraper;
  switch (request.gameID) {
    case 1:
      scraper = new GenericScraper(
        "https://www.ea.com/en-gb/games/apex-legends/news#news",
        ApexParser,
        false
      );
      break;
    case 2:
      const url: string = getCounterStrikeScrapeParameters(request.type);
      scraper = new GenericScraper(url, CounterStrikeParser);
      break;
    case 3:
      scraper = new GenericScraper("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
      break;
    case 4:
      scraper = new GenericScraper("https://playhearthstone.com/en-us/news", HearthstoneParser);
      break;
    case 5:
      scraper = new GenericScraper(
        "https://na.leagueoflegends.com/en-us/latest-news/",
        LeagueParser
      );
      break;
    case 6:
      scraper = getOverwatchScraper(request);
      break;
    case 7:
      scraper = new GenericScraper("https://playruneterra.com/en-us/news", RuneterraParser);
      break;
    case 8:
      scraper = new GenericScraper("https://playvalorant.com/en-us/news/", ValorantParser);
      break;
    case 9:
      scraper = new GenericScraper(
        "https://teamfighttactics.leagueoflegends.com/en-us/news/",
        TFTParser
      );
      break;
    default:
      return null;
  }

  return scraper;
}

function getCounterStrikeScrapeParameters(type: string): string {
  let url: string;
  if (!type || type === "news") url = "https://blog.counter-strike.net/";
  else url = "https://blog.counter-strike.net/index.php/category/updates/";
  return url;
}

function getOverwatchScraper(request: Request): Scraper {
  let url: string;
  let parser: () => any;
  let scraper;
  if (!request.type || request.type === "news") {
    url = "https://playoverwatch.com/en-us/news";
    parser = OverwatchNewsParser;
    scraper = new GenericScraper(url, parser);
  } else if (request.type === "patch") {
    url = "https://playoverwatch.com/en-us/news/patch-notes/live";
    parser = OverwatchPatchParser;
    scraper = new GenericScraper(url, parser);
  } else {
    url = request.article.link;
    parser = OverwatchArticleDateParser;
    scraper = new OverwatchDetailsScraper(url, parser, request.article);
  }
  return scraper;
}
