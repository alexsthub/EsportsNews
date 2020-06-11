import mysql from "mysql2/promise";

const config: any = {
  host: "news.c2cq8ee6kdum.us-west-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: process.env.newsDBPassword,
  database: "news",
};

export default async function getDatabaseConnection(): Promise<mysql.Connection> {
  let connection: mysql.Connection = await mysql.createConnection(config);
  console.log("Connected!");
  return connection;
}
