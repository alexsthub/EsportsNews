import Data from "./Models/Data";
import Request from "./Models/Request";
import Scraper from "./Models/Scraper";
import db from "./db/dbConnect";
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
  const record: any = event.Records[0];
  const body: string = record.body;
  const requestMessage: Request = JSON.parse(body);

  const scraper: Scraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  console.log(scrapedArticles);

  getArticlesByGameId(requestMessage.gameID, db, (result: any) => {
    if (!result) return;
    const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
    if (newArticles.length > 0) {
      if (isOverwatchNews(requestMessage)) {
        return produceOverwatchDetailsMessagesToSQS(newArticles);
      } else {
        insertArticlesToDatabase(newArticles, requestMessage.gameID, db);
        return sendArticlesToWebsocketServer(newArticles);
      }
    }
  });

  return;
};

(async () => {
  const requestMessage: Request = {
    gameID: 5,
    type: "news",
  };
  const scraper: Scraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  console.log(scrapedArticles);

  getArticlesByGameId(requestMessage.gameID, db, (result: any) => {
    if (!result) return;
    const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
    if (newArticles.length > 0) {
      if (isOverwatchNews(requestMessage)) {
        return produceOverwatchDetailsMessagesToSQS(newArticles);
      } else {
        insertArticlesToDatabase(newArticles, requestMessage.gameID, db);
        return sendArticlesToWebsocketServer(newArticles);
      }
    }
  });
})();
