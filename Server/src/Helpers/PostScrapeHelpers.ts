import MySQL from "mysql";
import moment from "moment";
import Data from "../Models/Data";

// Query the most recent 30 articles to use as reference to see if they exist.
export function getArticlesByGameId(gameID: number, db: MySQL.Connection, callback: Function) {
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
export function checkForNewArticles(input: Data[], existing: any): Data[] {
  const ret: Data[] = [];
  input.forEach((inputObj) => {
    const exists: boolean = existing.some((e: any) => e.title === inputObj.title);
    if (!exists) ret.push(inputObj);
  });

  return ret;
}

export function insertArticlesToDatabase(
  newArticles: Data[],
  gameID: number,
  db: MySQL.Connection
) {
  const formattedInserts = formatArticlesToInsertStatements(newArticles, gameID);
  const queryString =
    "INSERT INTO articles (title, description, link, imageUrl, category, game_id, date_published, date_entered) VALUES ?";
  db.query(queryString, [formattedInserts], (err, result) => {
    if (err) {
      throw err;
    }
  });
}

export function formatArticlesToInsertStatements(newArticles: Data[], gameID: number) {
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
export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const isValidDate: boolean = d instanceof Date && !isNaN(d as any);
  if (!isValidDate) return null;
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export function isOverwatchNews(requestMessage: any): boolean {
  return requestMessage.gameID === 6 && (!requestMessage.type || requestMessage.type === "news");
}

export function produceMessagesToSQS(newArticles: Data[]): void {
  newArticles.forEach((article) => {
    const newMessage: any = {
      gameID: 6,
      type: "details",
      article: article,
    };
    const messageString: string = JSON.stringify(newMessage);
    console.log(messageString);
    const params = {
      QueueUrl: "queueURL",
      DelaySeconds: 0,
      MessageBody: messageString,
      MessageDeduplicationId: article.title,
      MessageGroupId: "articles",
    };
    // sqs.sendMessage(params, function (err: any, _: any) {
    //   if (err) console.log(err);
    // });
  });
}
