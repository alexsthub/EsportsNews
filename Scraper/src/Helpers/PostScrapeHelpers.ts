import moment from "moment";
import Data from "../Models/Data";
import AWS from "aws-sdk";
import ArticleResponse from "../Models/ArticleResponse";

// Query the most recent 30 articles to use as reference to see if they exist.
export async function getArticlesByGameId(gameID: number, size: number, db: any): Promise<any> {
  const limit: number = size + 10;
  const query: string = `SELECT * FROM articles WHERE game_id = ? ORDER BY date_published desc limit ${limit}`;
  const [rows, _] = await db.execute(query, [gameID]);
  return rows;
}

// O(n^2) but only a max N of 30 so I'm going to say its OK.
export function checkForNewArticles(input: Data[], existing: any): Data[] {
  const ret: Data[] = [];
  input.forEach((inputObj) => {
    const exists: boolean = existing.some(
      (e: any) => e.title.toLowerCase() === inputObj.title.toLowerCase()
    );
    if (!exists) ret.push(inputObj);
  });

  return ret;
}

export async function insertArticlesToDatabase(
  newArticles: Data[],
  gameID: number,
  db: any
): Promise<ArticleResponse[]> {
  const formattedInserts = formatArticlesToInsertStatements(newArticles, gameID);
  const queryString =
    "INSERT INTO articles (title, description, link, imageUrl, category, game_id, date_published, date_entered) VALUES ?";
  const [result, _] = await db.query(queryString, [formattedInserts]);
  console.log(`Inserted ${result.affectedRows} rows.`);
  const firstInsertID: number = result.insertId;
  const getArticlesQuery: string =
    "SELECT id, title, description, link, imageUrl, category, game_id, date_published FROM articles WHERE game_id = ? AND id >= ?";
  const response = await db.query(getArticlesQuery, [gameID, firstInsertID]);
  const articles: ArticleResponse[] = response[0];
  return articles;
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

export async function produceOverwatchDetailsMessagesToSQS(newArticles: Data[]) {
  console.log("Sending overwatch details messages to SQS");
  AWS.config.update({ region: "us-west-2" });
  const sqs = new AWS.SQS();
  for (let i = 0; i < newArticles.length; i++) {
    const article: Data = newArticles[i];
    const newMessage: any = {
      gameID: 6,
      type: "details",
      article: article,
    };
    const messageString: string = JSON.stringify(newMessage);
    console.log(messageString);
    const params: any = {
      MessageBody: messageString,
      DelaySeconds: 0,
      QueueUrl: process.env.articlesQueueUrl,
    };
    let res = await sqs.sendMessage(params).promise();
    console.log(res);
  }
  return;
}

export async function sendArticlesToWebsocketServer(newArticles: ArticleResponse[]) {
  const sqs = new AWS.SQS();

  const message: string = JSON.stringify(newArticles);
  console.log("Sending new articles to websocket server");
  console.log(message);
  const params: any = {
    MessageBody: message,
    DelaySeconds: 0,
    QueueUrl: process.env.websocketQueueUrl,
  };
  let res = await sqs.sendMessage(params).promise();
  console.log(res);
  return;
}
