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

// TODO: Overwatch needs like 3 different parsers.
// TODO: CS has two different pages same parser
export default function constructScraper(gameID: number): GenericScraper {
  let scraper: GenericScraper;
  switch (gameID) {
    case 1:
      scraper = new GenericScraper(
        "https://www.ea.com/en-gb/games/apex-legends/news#news",
        ApexParser,
        false
      );
      break;
    case 2:
      scraper = new GenericScraper(
        "https://blog.counter-strike.net/index.php/category/updates/",
        CounterStrikeParser
      );
      break;
    case 3:
      scraper = new GenericScraper("https://www.epicgames.com/fortnite/en-US/news", FortniteParser);
      break;
    case 4:
      scraper = new GenericScraper("https://playhearthstone.com/en-us/news", HearthstoneParser);
      break;
    case 5:
      scraper = new GenericScraper(
        "https://na.leagueoflegends.com/en-us/news/game-updates/",
        LeagueParser
      );
      break;
    case 6:
      scraper = new GenericScraper("https://playoverwatch.com/en-us/news", OverwatchNewsParser);
      break;
    case 7:
      scraper = new GenericScraper("https://playruneterra.com/en-us/news", RuneterraParser);
      break;
    case 8:
      scraper = new GenericScraper("https://beta.playvalorant.com/en-us/news/", ValorantParser);
      break;
  }

  return scraper;
}
