import mysql from "mysql";

const port = 3306;
let con: mysql.Connection = mysql.createConnection({
  host: "news.c2cq8ee6kdum.us-west-2.rds.amazonaws.com",
  port: port,
  user: "admin",
  password: process.env.newsDBPassword,
  database: "news",
});
con.connect(function (err: any) {
  if (err) throw err;
  console.log("Connected!");
});

export default con;
