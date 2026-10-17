import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { buildDbSslOptions } from "../src/utility/dbSsl.js";
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  // Cloud databases (Aiven) use their own port. Locally: 3306.
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
  timezone: "Z",
  ssl: buildDbSslOptions(process.env),
});

// Every query goes through here with ? placeholders, so values are always escaped
const safeExecute = async (sql, params) => {
  if (!Array.isArray(params)) {
    throw new Error("SQL parameters must be an array");
  }
  const [result] = await db.execute(sql, params);
  return result;
};

export { db, safeExecute };
