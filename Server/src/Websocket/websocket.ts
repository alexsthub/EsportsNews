import * as WebSocket from "ws";
import * as SqsConsumer from "sqs-consumer";

import AWS from "aws-sdk";
AWS.config.update({ region: "us-west-2" });

class WebsocketServer {
  private _server: WebSocket.Server;

  constructor() {
    this._server = this.getServer();
    this.setConnectionHandler();
    this.setBrokenConnectionHandler();
  }

  get server(): WebSocket.Server {
    return this._server;
  }

  getServer(): WebSocket.Server {
    const wss: WebSocket.Server = new WebSocket.Server({
      port: 9000,
      perMessageDeflate: {
        zlibDeflateOptions: {
          chunkSize: 1024,
          memLevel: 7,
          level: 3,
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024,
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024,
      },
    });
    return wss;
  }

  setConnectionHandler(): void {
    this._server.on("connection", (ws: any) => {
      ws.isAlive = true;

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", function incoming(message: any) {
        console.log("received: %s", message);
        ws.send(`I heard you said: ${message}`);
      });
    });
  }

  setBrokenConnectionHandler(): void {
    setInterval(() => {
      console.log("Pinging");
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
    const body: string = message.Body;
    console.log(body);
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

const websocket: WebsocketServer = new WebsocketServer();
const sqsPoll = new SqsLongPoll(process.env.websocketQueueUrl);
sqsPoll.start();
