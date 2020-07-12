import MySql from "mysql2/promise";

export default async function getDatabaseConnection(multipleQueries?: boolean) {
  const multipleStatements: boolean = multipleQueries ? multipleQueries : false;

  const config: object = {
    host: process.env.newsDBHost,
    port: 3306,
    user: process.env.newsDBUser,
    password: process.env.newsDBPassword,
    database: "news",
    multipleStatements: multipleStatements,
  };
  let connection: MySql.Connection = await MySql.createConnection(config);
  console.log("Connected!");
  return connection;
}
