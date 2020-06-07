import constructScraper from "../Helpers/ConstructScraper";
import GenericScraper from "../Models/Scraper";
import Data from "../Models/Data";
import MySQL from "mysql";

// TODO: Some logic here to see if there is anything new.
export default async function ScrapeHandler(req: any, res: any, db: MySQL.Connection) {
  // const gameID: number = Number(req.params.gameID);
  // const scraper: GenericScraper = constructScraper(gameID);
  // const data: Data[] = await scraper.scrape();
  // if (data) {
  //   res.status(200);
  //   res.json(data);
  //   return;
  // }
  // res.status(400);
  // res.send("Error");
}
