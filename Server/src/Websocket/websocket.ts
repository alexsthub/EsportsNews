import * as WebSocket from "ws";
import * as SqsConsumer from "sqs-consumer";
import MySql from "mysql2/promise";
import AWS from "aws-sdk";
import { Article, ArticleStore } from "./ArticleStore";
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

  private initServer(): WebSocket.Server {
    const wss: WebSocket.Server = new WebSocket.Server({ port: 9000 });
    return wss;
  }

  private setConnectionHandler(): void {
    this._server.on("connection", (ws: any) => {
      ws.isAlive = true;

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (message: any) => {
        const body: any = JSON.parse(message);

        const subscriptions: any = body.subscriptions;
        const type: string = body.type;
        // TODO: 1.) "init" connection => addToConnectionMap, 2.) "update" => updateConnectionMap
        if (type === "init") this.addToConnectionMap(ws, subscriptions);
        // else if (type === "update") this.updateConnectionMap(ws, subscriptions);

        const newArticles: any = this.checkForNewArticles(subscriptions);
        const ret: string = JSON.stringify(newArticles);
        ws.send(ret);
      });
    });
  }

  // Subscriptions is an object where key = gameID and value is list of sorted articleIDs
  private checkForNewArticles(subscriptions: any): any {
    let newArticles: any = {};
    const serverArticles: Map<number, Article[]> = recentArticles.getArticles();
    Object.keys(subscriptions).forEach((strGameID: string) => {
      const gameID: number = Number(strGameID);
      const clientArticleIds: number[] = subscriptions[gameID];
      const serverArticlesForGame: Article[] = serverArticles.get(gameID);

      const res: Article[] = serverArticlesForGame.filter(
        (serverArticle) =>
          !clientArticleIds.some((clientArticleID) => clientArticleID === serverArticle.id)
      );
      if (res.length > 0) {
        newArticles[gameID] = res;
      }
    });
    return newArticles;
  }

  private addToConnectionMap(socket: any, subscriptions: any): void {
    Object.keys(subscriptions).forEach((strGameID: string) => {
      const gameID: number = Number(strGameID);
      const mapping: Map<number, any[]> = this.gameToConnection;
      if (!mapping.has(gameID)) mapping.set(gameID, []);
      const connectionList = mapping.get(gameID);
      connectionList.push(socket);
    });
    console.log(this.gameToConnection);
  }

  // TODO: Update gameToConnection when client changes game subscription
  private updateConnectionMap(socket: any, subscriptions: any): void {
    //
  }

  // TODO: When you close a connection, I need to remove from subscriptions as well.
  setBrokenConnectionHandler(): void {
    setInterval(() => {
      this._server.clients.forEach((ws: any) => {
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

  setErrorHandlers(): void {
    this.consumer.on("error", (err: any) => {
      console.error(err.message);
    });

    this.consumer.on("processing_error", (err: any) => {
      console.error(err.message);
    });
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
    // TODO: When we get new articles, we have to update `recentArticles`.
    // TODO: Broadcast somehow. How do i get websocket object. Maybe I don't encapsulate the SQS poller in a class.
  }
}

const recentArticles: ArticleStore = new ArticleStore(8);
(async () => {
  const db: MySql.Connection = await getDatabaseConnection(true);
  const queryString: string = `
    set @rank = 0;
    set @current_gameid = 0;
    SELECT id, game_id, title, description, link, imageUrl, category, date_published
    FROM 
      (SELECT *, @rank := IF(@current_gameid = game_id, @rank + 1, 1) as row_num, @current_gameid := game_id as current_game_id
      FROM articles order by game_id, date_published desc) ranked
    WHERE row_num <= 5;`;
  const response: any = await db.query(queryString);
  const rows: Article[] = response[0][2];
  rows.forEach((row: Article) => {
    recentArticles.insert(row);
  });

  const websocket: WebsocketServer = new WebsocketServer();
  // const sqsPoll = new SqsLongPoll(process.env.websocketQueueUrl);
  // sqsPoll.start();
})();
