import * as WebSocket from "ws";
import * as SqsConsumer from "sqs-consumer";
import MySql from "mysql2/promise";
import AWS from "aws-sdk";
import { Article, ArticleStore } from "./ArticleStore";
AWS.config.update({ region: "us-west-2" });
import getDatabaseConnection from "../db/dbConnect";

interface SubscriptionObj {
  [key: number]: number[];
}

class WebsocketServer {
  private nextID: number;
  private _server: WebSocket.Server;
  private gameToConnection: Map<number, any[]> = new Map<number, any[]>();

  constructor() {
    this.nextID = 0;
    this._server = this.initServer();
    this.setConnectionHandler();
    this.setBrokenConnectionHandler();
  }

  get server(): WebSocket.Server {
    return this._server;
  }

  public broadcastToGroup(gameID: number, articleString: string) {
    const connections: any[] = this.gameToConnection.get(gameID);
    if (connections) {
      connections.forEach((connection) => {
        connection.send(articleString);
      });
    }
  }

  private initServer(): WebSocket.Server {
    const wss: WebSocket.Server = new WebSocket.Server({ port: 9000 });
    return wss;
  }

  private setConnectionHandler(): void {
    this._server.on("connection", (ws: any) => {
      ws.isAlive = true;
      ws.id = ++this.nextID;
      ws.subscriptions = [];

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("close", () => {
        this.removeFromConnectionMap(ws, ws.subscriptions);
      });

      ws.on("message", (message: any) => {
        const body: any = JSON.parse(message);

        const subscriptions: SubscriptionObj = body.subscriptions;
        const type: string = body.type;
        if (type === "init") {
          this.addToConnectionMap(ws, subscriptions);
          const newArticles: any = this.checkForNewArticles(subscriptions);
          const ret: string = JSON.stringify(newArticles);
          ws.send(ret);
        } else if (type === "update") {
          this.updateConnectionMap(ws, body.updates);
          if (body.updates.additions) {
            const newArticles: any = this.checkForNewArticles(body.updates.additions);
            const ret: string = JSON.stringify(newArticles);
            ws.send(ret);
          }
        }
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
      socket.subscriptions.push(gameID);
    });
  }

  private updateConnectionMap(socket: any, updates: any): void {
    if (!updates) return;
    if (updates.additions) {
      const newSubscriptions: SubscriptionObj = updates.additions;
      this.addToConnectionMap(socket, newSubscriptions);
    }
    if (updates.removals) {
      const unsubscribeIDs: number[] = updates.removals;
      this.removeFromConnectionMap(socket, unsubscribeIDs);
    }
  }

  private removeFromConnectionMap(socket: any, unsubscribeIDs: number[]) {
    unsubscribeIDs.forEach((id: number) => {
      if (this.gameToConnection.has(id)) {
        const connectionList: any[] = this.gameToConnection.get(id);
        const filteredList: any[] = connectionList.filter((c) => c.id !== socket.id);
        this.gameToConnection.set(id, filteredList);
      }
    });
    socket.subscriptions = socket.subscriptions.filter((x: number) => !unsubscribeIDs.includes(x));
  }

  setBrokenConnectionHandler(): void {
    setInterval(() => {
      this._server.clients.forEach((ws: any) => {
        if (!ws.isAlive) {
          this.removeFromConnectionMap(ws, ws.connections);
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping(null, false, true);
      });
    }, 10000);
  }
}

async function handleMessage(message: any, websocketObj: WebsocketServer) {
  const jsonString: string = message.Body;
  const articles: Article[] = JSON.parse(jsonString);
  const gameID: number = articles[0].game_id;

  websocketObj.broadcastToGroup(gameID, jsonString);
  articles.forEach((article: Article) => {
    recentArticles.insert(article);
  });
}

const recentArticles: ArticleStore = new ArticleStore(5);
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

  const websocketObj: WebsocketServer = new WebsocketServer();
  const consumer: SqsConsumer.Consumer = SqsConsumer.Consumer.create({
    queueUrl: process.env.websocketQueueUrl,
    handleMessage: async (message: any) => await handleMessage(message, websocketObj),
  });
  consumer.on("error", (err: any) => {
    console.error(err.message);
  });

  consumer.on("processing_error", (err: any) => {
    console.error(err.message);
  });
  consumer.start();
})();
