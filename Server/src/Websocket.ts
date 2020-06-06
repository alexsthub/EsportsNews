import * as WebSocket from "ws";

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

wss.on("connection", (ws: any) => {
  ws.isAlive = true;

  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", function incoming(message: any) {
    console.log("received: %s", message);
    ws.send(`I heard you said: ${message}`);
  });
});

setInterval(() => {
  console.log("PINGING");
  wss.clients.forEach((ws: any) => {
    if (!ws.isAlive) return ws.terminate();

    ws.isAlive = false;
    ws.ping(null, false, true);
  });
}, 10000);

export default wss;
