import constructScraper from "./Helpers/ConstructScraper";
import GenericScraper from "./Models/Scraper";
import MySQL from "mysql";
import Data from "./Models/Data";
import db from "./db/dbConnect";

function getArticlesByGameId(gameID: number, db: MySQL.Connection, callback: Function) {
  db.query("SELECT * FROM articles WHERE game_id = ?", gameID, (err, result) => {
    if (err) {
      callback(null);
    } else {
      callback(result);
    }
  });
}

function checkForNewArticles(input: Data[], existing: any): Data[] {
  // TODO: Implement logic

  const ret: Data[] = [];
  return ret;
}

function insertArticlesToDatabase(newArticles: Data[], gameID: number, db: MySQL.Connection) {
  const formattedInserts = formatArticlesToInsertStatements(newArticles, gameID);
  const queryString =
    "INSERT INTO articles (title, description, link, imageUrl, category, authors, game_id, date_published, date_entered) VALUES ?";
  console.log(queryString);
  db.query(queryString, formattedInserts, (err, result) => {
    if (err) return;
    console.log("Number of records inserted: " + result.affectedRows);
  });
}

// TODO: Use moment
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
    currentResult.push(article.authors ? article.authors.join(",") : null);
    currentResult.push(gameID);
    // TODO: Format date;
    currentResult.push("ahh");
    currentResult.push("current_timestamp");

    results.push(currentResult);
  }
  return results;
}

(async function () {
  const gameID: number = 4;
  const scraper: GenericScraper = constructScraper(gameID);
  const scrapedArticles: Data[] = await scraper.scrape();
  console.log(scrapedArticles);

  getArticlesByGameId(gameID, db, (result: any) => {
    if (!result) return;
    console.log(result);
    const newArticles = checkForNewArticles(scrapedArticles, result);
    insertArticlesToDatabase(newArticles, gameID, db);
  });
})();
