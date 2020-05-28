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

import GenericScraper from "../Models/Scraper";

export default function constructScraper(type: string): GenericScraper {
  let scraper: GenericScraper;
  switch (type) {
    case "League":
      scraper = new GenericScraper(
        "https://na.leagueoflegends.com/en-us/news/game-updates/",
        LeagueParser
      );
      break;
    case "Runeterra":
      scraper = new GenericScraper("https://playruneterra.com/en-us/news", RuneterraParser);
      break;
    case "Apex":
      scraper = new GenericScraper(
        "https://www.ea.com/en-gb/games/apex-legends/news#news",
        ApexParser,
        false
      );
      break;
    case "Fortnite":
      scraper = new GenericScraper("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
      break;
    case "Valorant":
      scraper = new GenericScraper("https://beta.playvalorant.com/en-us/news/", ValorantParser);
      break;
    case "CounterStrike":
      scraper = new GenericScraper(
        "https://blog.counter-strike.net/index.php/category/updates/",
        CounterStrikeParser
      );
      break;
    case "Hearthstone":
      scraper = new GenericScraper("https://playhearthstone.com/en-us/news", HearthstoneParser);
      break;
    case "Overwatch":
      scraper = new GenericScraper("https://playoverwatch.com/en-us/news", OverwatchNewsParser);
  }

  return scraper;
}
