import MySQL from "mysql";
import moment from "moment";

import constructScraper from "./Helpers/ConstructScraper";
import GenericScraper from "./Models/Scraper";
import Data from "./Models/Data";
import Request from "./Models/Request";
import db from "./db/dbConnect";

// Query the most recent 30 articles to use as reference to see if they exist.
function getArticlesByGameId(gameID: number, db: MySQL.Connection, callback: Function) {
  db.query(
    "SELECT * FROM articles WHERE game_id = ? ORDER BY id limit 30",
    gameID,
    (err, result) => {
      if (err) {
        callback(null);
      } else {
        callback(result);
      }
    }
  );
}

// O(n^2) but only a max N of 30 so I'm going to say its OK.
function checkForNewArticles(input: Data[], existing: any): Data[] {
  const ret: Data[] = [];
  input.forEach((inputObj) => {
    const exists: boolean = existing.some((e: any) => e.title === inputObj.title);
    if (!exists) ret.push(inputObj);
  });

  return ret;
}

function insertArticlesToDatabase(newArticles: Data[], gameID: number, db: MySQL.Connection) {
  const formattedInserts = formatArticlesToInsertStatements(newArticles, gameID);
  const queryString =
    "INSERT INTO articles (title, description, link, imageUrl, category, game_id, date_published, date_entered) VALUES ?";
  db.query(queryString, [formattedInserts], (err, result) => {
    if (err) {
      throw err;
    }
  });
}

function formatArticlesToInsertStatements(newArticles: Data[], gameID: number) {
  let results: any[][] = [];

  for (let i = 0; i < newArticles.length; i++) {
    let currentResult = [];
    const article: Data = newArticles[i];
    currentResult.push(article.title);
    currentResult.push(article.description);
    currentResult.push(article.link);
    currentResult.push(article.imageUrl);
    currentResult.push(article.category);
    currentResult.push(gameID);
    currentResult.push(formatDate(article.rawDatetime));
    currentResult.push(moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"));

    results.push(currentResult);
  }
  return results;
}

// Takes a date string and formats into YYYY-MM-DD
function formatDate(dateString: string): string {
  const d = new Date(dateString);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

(async function () {
  const requestMessage: Request = {
    gameID: 2,
  };
  const scraper: GenericScraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  console.log(scrapedArticles);

  getArticlesByGameId(requestMessage.gameID, db, (result: any) => {
    if (!result) return;
    const newArticles = checkForNewArticles(scrapedArticles, result);
    if (newArticles.length > 0) {
      insertArticlesToDatabase(newArticles, requestMessage.gameID, db);
      // TODO: Broadcast these newArticles.
    }
  });
})();

// TODO: Work on getting the category for each parser. (News vs Updates)
