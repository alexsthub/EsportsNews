import express from "express";
import morgan from "morgan";
import cors from "cors";

import db from "./db/dbConnect";
import ws from "./Websocket";

import WebsocketConnectionHandler from "./Handlers/WebsocketHandler";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

let port: number = Number(process.env.PORT) || 8080;

app.all("/v1/ws", (req, res) => {
  WebsocketConnectionHandler(req, res);
});

app.get("/", (req, res) => {
  res.send("Hello world!");
  db.query("select * from games", function (err, result) {
    console.log(result);
  });
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
