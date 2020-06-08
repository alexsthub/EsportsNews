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
} from "./Helpers/PostScrapeHelpers";

import AWS from "aws-sdk";
AWS.config.update({ region: "us-west-2" });
const sqs = new AWS.SQS();

// var params = {
//   MessageBody: "Testing the stuff",
//   MessageDeduplicationId: "Testing", // Required for FIFO queues
//   MessageGroupId: "Group1", // Required for FIFO queues
//   QueueUrl: "https://sqs.us-west-2.amazonaws.com/655373160788/articles.fifo",
// };

// sqs.sendMessage(params, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.MessageId);
//   }
// });

// const params = {};
// sqs.listQueues({}, function (err, data) {
//   if (err) {
//     console.log("Error", err);
//   } else {
//     console.log("Success", data.QueueUrls);
//   }
// });

(async function () {
  const requestMessage: Request = {
    gameID: 6,
    type: "details",
    article: {
      title: "Overwatch Double XP Weekend | June 5-9",
      link: "https://playoverwatch.com/en-us/news/23445048/overwatch-double-xp-weekend-june-5-9",
      imageUrl: "bnetcmsus-a.akamaihd.net/cms/blog_thumbnail/sv/SVP92ZTXU8M21591062501006.png",
      category: "general",
    },
  };
  const scraper: Scraper = constructScraper(requestMessage);
  const scrapedArticles: Data[] = await scraper.scrape();
  console.log(scrapedArticles);

  getArticlesByGameId(requestMessage.gameID, db, (result: any) => {
    if (!result) return;
    const newArticles: Data[] = checkForNewArticles(scrapedArticles, result);
    if (newArticles.length > 0) {
      if (isOverwatchNews(requestMessage)) {
        produceOverwatchDetailsMessagesToSQS(newArticles);
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
