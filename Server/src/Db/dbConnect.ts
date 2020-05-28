import mysql from "mysql";

const port = 3306;
let con: mysql.Connection = mysql.createConnection({
  host: "localhost",
  port: port,
  user: "root",
  password: process.env.newsDBPassword,
  database: "news",
});
con.connect(function (err: any) {
  if (err) throw err;
  console.log("Connected!");
});

export default con;
