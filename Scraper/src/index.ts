import MySql from "mysql2/promise";
import Data from "./Models/Data";
import ArticleResponse from "./Models/ArticleResponse";
import Request from "./Models/Request";
import Scraper from "./Models/Scraper";
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

exports.handler = async (event: any) => {
  const db: MySql.Connection = await getDatabaseConnection();

  const record: any = event.Records[0];
  const body: string = record.body;
  const requestMessage: Request = JSON.parse(body);

  const scraper: Scraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  if (!scrapedArticles || scrapedArticles.length === 0) return;
  console.log(`Scraped ${scrapedArticles.length} articles.`);

  const result: any = await getArticlesByGameId(requestMessage.gameID, scrapedArticles.length, db);
  if (!result) return;
  const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
  console.log(`There are ${newArticles.length} new articles.`);
  if (newArticles.length > 0) {
    if (isOverwatchNews(requestMessage)) {
      await produceOverwatchDetailsMessagesToSQS(newArticles);
    } else {
      const articles: ArticleResponse[] = await insertArticlesToDatabase(
        newArticles,
        requestMessage.gameID,
        db
      );
      await sendArticlesToWebsocketServer(articles);
    }
  }
  await db.end();
  return;
};
