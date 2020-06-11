import Data from "./Models/Data";
import Request from "./Models/Request";
import Scraper from "./Models/Scraper";
import mysql from "mysql2/promise";
import getDatabaseConnection from "./db/dbConnect";
import constructScraper from "./Helpers/ConstructScraper";
import {
  getArticlesByGameId,
  checkForNewArticles,
  isOverwatchNews,
  produceOverwatchDetailsMessagesToSQS,
  insertArticlesToDatabase,
  sendArticlesToWebsocketServer,
} from "./Helpers/PostScrapeHelpers";

import AWS from "aws-sdk";
AWS.config.update({ region: "us-west-2" });

(async function () {
  const requestMessage: Request = {
    gameID: 5,
    type: "news",
  };
  const db: mysql.Connection = await getDatabaseConnection();
  const scraper: Scraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  if (!scrapedArticles || scrapedArticles.length === 0) return;
  console.log(scrapedArticles);

  const result: any = await getArticlesByGameId(requestMessage.gameID, db);
  console.log("RESULT");
  console.log(result);
  if (!result) return;
  const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
  console.log("NEW ARTICLES");
  console.log(newArticles);
  if (newArticles.length > 0) {
    if (isOverwatchNews(requestMessage)) {
      return produceOverwatchDetailsMessagesToSQS(newArticles);
    } else {
      console.log("Inserting");
      insertArticlesToDatabase(newArticles, requestMessage.gameID, db);
      return sendArticlesToWebsocketServer(newArticles);
    }
  }
})();

exports.handler = async (event: any) => {
  const db: mysql.Connection = await getDatabaseConnection();

  const record: any = event.Records[0];
  const body: string = record.body;
  const requestMessage: Request = JSON.parse(body);

  const scraper: Scraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  if (!scrapedArticles || scrapedArticles.length === 0) return;
  console.log(scrapedArticles);

  const result: any = await getArticlesByGameId(requestMessage.gameID, db);
  console.log("RESULT");
  console.log(result);
  if (!result) return;
  const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
  console.log("NEW ARTICLES");
  console.log(newArticles);
  if (newArticles.length > 0) {
    if (isOverwatchNews(requestMessage)) {
      return produceOverwatchDetailsMessagesToSQS(newArticles);
    } else {
      console.log("Inserting");
      insertArticlesToDatabase(newArticles, requestMessage.gameID, db);
      return sendArticlesToWebsocketServer(newArticles);
    }
  }

  return;
};
