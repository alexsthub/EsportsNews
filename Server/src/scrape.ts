import GenericScraper from "./Models/Scraper";
import Data from "./Models/Data";
import Request from "./Models/Request";
import db from "./db/dbConnect";
import constructScraper from "./Helpers/ConstructScraper";
import {
  getArticlesByGameId,
  checkForNewArticles,
  isOverwatchNews,
  produceMessagesToSQS,
  insertArticlesToDatabase,
} from "./Helpers/PostScrapeHelpers";

// const AWS = require("aws-sdk");
// AWS.config.update({ region: "us-west-2" });
// const sqs = new AWS.SQS();

(async function () {
  const requestMessage: Request = {
    gameID: 6,
    type: "news",
  };
  const scraper: GenericScraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  console.log(scrapedArticles);

  getArticlesByGameId(requestMessage.gameID, db, (result: any) => {
    if (!result) return;
    const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
    if (newArticles.length > 0) {
      if (isOverwatchNews(requestMessage)) {
        produceMessagesToSQS(newArticles);
      } else {
        insertArticlesToDatabase(newArticles, requestMessage.gameID, db);
        // TODO: Broadcast these newArticles.
      }
    }
  });
})();

// var params = {
//   AttributeNames: [
//      "SentTimestamp"
//   ],
//   MaxNumberOfMessages: 10,
//   MessageAttributeNames: [
//      "All"
//   ],
//   QueueUrl: 'tempQueueURL',
//   VisibilityTimeout: 20,
//   WaitTimeSeconds: 0
//  };

//  sqs.receiveMessage(params, function(err: any, data: any) {
//    if (err) {
//      console.log("Receive Error", err);
//      return;
//    } else {
//     var deleteParams = {
//       QueueUrl: 'tempQueueURL',
//       ReceiptHandle: data.Messages[0].ReceiptHandle
//     };
//     sqs.deleteMessage(deleteParams, function(err: any, data: any) {
//       if (err) {
//         console.log("Delete Error", err);
//       } else {
//         console.log("Message Deleted", data);
//       }
//     });
//    }
//  });
