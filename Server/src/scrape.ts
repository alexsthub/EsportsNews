import constructScraper from "./Helpers/ConstructScraper";
import GenericScraper from "./Models/Scraper";
import MySQL from "mysql";
import db from "./Db/dbConnect";

// TODO: Some logic here to see if there is anything new.
function getArticlesByGameId(gameID: number, db: MySQL.Connection, callback: Function) {
  db.query("SELECT * FROM articles WHERE game_id = ?", gameID, (err, result) => {
    if (err) {
      callback(null);
    } else {
      callback(result);
    }
  });
}

(async function () {
  const gameID: number = 5;
  const scraper: GenericScraper = constructScraper(gameID);
  const data = await scraper.scrape();
  console.log(data);
  getArticlesByGameId(gameID, db, (result: any) => {
    if (!result) return;
    // TODO: Check if any of the data is unique
  });
})();
