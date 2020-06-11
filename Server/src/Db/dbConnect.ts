import MySql from "mysql2/promise";

const config: object = {
  host: process.env.newsDBHost,
  port: 3306,
  user: process.env.newsDBUser,
  password: process.env.newsDBPassword,
  database: "news",
};

export default async function getDatabaseConnection() {
  let connection: MySql.Connection = await MySql.createConnection(config);
  console.log("Connected!");
  return connection;
}
