import * as WebSocket from "ws";
import * as SqsConsumer from "sqs-consumer";
import MySql from "mysql2/promise";
import AWS from "aws-sdk";
AWS.config.update({ region: "us-west-2" });
import getDatabaseConnection from "../db/dbConnect";

class WebsocketServer {
  private _server: WebSocket.Server;
  private gameToConnection: Map<number, any[]> = new Map<number, any[]>();

  constructor() {
    this._server = this.initServer();
    this.setConnectionHandler();
    this.setBrokenConnectionHandler();
  }

  get server(): WebSocket.Server {
    return this._server;
  }

  initServer(): WebSocket.Server {
    const wss: WebSocket.Server = new WebSocket.Server({ port: 9000 });
    return wss;
  }

  setConnectionHandler(): void {
    this._server.on("connection", (ws: any) => {
      ws.isAlive = true;

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (message: any) => {
        const body: any = JSON.parse(message);

        const gameIDs: number[] = body.gameIDs;
        const init: boolean = body.init;
        if (init) this.addToConnectionMap(ws, gameIDs);

        const newArticles: any = this.checkForNewArticles(gameIDs);
        ws.send(`I heard you said: ${message}`);
      });
    });
  }

  checkForNewArticles(gameIDs: number[]) {
    console.log(recentArticles);
  }

  addToConnectionMap(socket: any, gameIDs: number[]): void {
    gameIDs.forEach((id: number) => {
      const mapping: Map<number, any[]> = this.gameToConnection;
      if (!mapping.has(id)) mapping.set(id, []);
      const connectionList = mapping.get(id);
      connectionList.push(socket);
    });
    console.log(this.gameToConnection);
  }

  setBrokenConnectionHandler(): void {
    setInterval(() => {
      websocket.server.clients.forEach((ws: any) => {
        if (!ws.isAlive) return ws.terminate();

        ws.isAlive = false;
        ws.ping(null, false, true);
      });
    }, 10000);
  }
}

class SqsLongPoll {
  private queueUrl: string;
  private consumer: SqsConsumer.Consumer;

  constructor(queueUrl: string) {
    this.queueUrl = queueUrl;
    this.consumer = this.createConsumer();
    this.setErrorHandlers();
  }

  start(): void {
    this.consumer.start();
  }

  stop(): void {
    this.consumer.stop();
  }

  createConsumer(): SqsConsumer.Consumer {
    const app: SqsConsumer.Consumer = SqsConsumer.Consumer.create({
      queueUrl: this.queueUrl,
      handleMessage: this.handleMessage,
    });
    return app;
  }

  async handleMessage(message: any) {
    const jsonString: string = message.Body;
    const body: any = JSON.parse(jsonString);
    console.log(body);
    // TODO: Broadcast somehow. How do i get websocket object. Maybe I don't encapsulate the SQS poller in a class.
  }

  setErrorHandlers(): void {
    this.consumer.on("error", (err: any) => {
      console.error(err.message);
    });

    this.consumer.on("processing_error", (err: any) => {
      console.error(err.message);
    });
  }
}

interface Article {
  title: string;
  game_id: number;
  category: string;
  link: string;
  date_published: Date;
  imageUrl?: string;
  description?: string;
}

class ArticleStore {
  private articles: Map<number, Article[]>;
  private maxArticlesPerGame: number;

  constructor(maxArticlesPerGame: number) {
    this.maxArticlesPerGame = maxArticlesPerGame;
    this.articles = new Map<number, Article[]>();
  }

  getArticles(): Map<number, Article[]> {
    return this.articles;
  }

  insert(article: Article): void {
    const gameID: number = article.game_id;
    if (!this.articles.has(gameID)) this.articles.set(gameID, []);
    const gameArticleList: Article[] = this.articles.get(gameID);
    if (gameArticleList.length >= this.maxArticlesPerGame) {
      gameArticleList.pop();
    }
    this.sortedInsert(gameArticleList, article);
  }

  private sortedInsert(gameArticleList: Article[], article: Article): void {
    for (let i = 0; i < gameArticleList.length; i++) {
      const currentArticle = gameArticleList[i];
      if (
        article.date_published >= currentArticle.date_published &&
        article.title !== currentArticle.title
      ) {
        gameArticleList.splice(i, 0, article);
        return;
      }
    }
    gameArticleList.push(article);
    return;
  }
}

// TODO: When we get new articles, we have to update `recentArticles`. Insert front delete back
// TODO: Also need to broadcast to the connections that are subscribed
// TODO: Update gameToConnection when client changes game subscription
const recentArticles: ArticleStore = new ArticleStore(8);
(async () => {
  const db: MySql.Connection = await getDatabaseConnection(true);
  const queryString: string = `
    set @rank = 0;
    set @current_gameid = 0;
    SELECT game_id, title, description, link, imageUrl, category, date_published
    FROM 
      (SELECT *, @rank := IF(@current_gameid = game_id, @rank + 1, 1) as row_num, @current_gameid := game_id as current_game_id
      FROM articles order by game_id, date_published desc) ranked
    WHERE row_num <= 8;`;
  const response: any = await db.query(queryString);
  const rows: Article[] = response[0][2];
  rows.forEach((row: Article) => {
    recentArticles.insert(row);
  });
  console.log(recentArticles.getArticles());
})();

const websocket: WebsocketServer = new WebsocketServer();
const sqsPoll = new SqsLongPoll(process.env.websocketQueueUrl);
sqsPoll.start();
