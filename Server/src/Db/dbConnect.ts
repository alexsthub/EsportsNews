import MySql from "mysql2/promise";

const config: object = {
  host: "news.c2cq8ee6kdum.us-west-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: process.env.newsDBPassword,
  database: "news",
};

export default async function getDatabaseConnection() {
  let connection: MySql.Connection = await MySql.createConnection(config);
  console.log("Connected!");
  return connection;
}
