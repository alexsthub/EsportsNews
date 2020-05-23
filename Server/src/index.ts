import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

let port: number = Number(process.env.PORT) || 8080;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
