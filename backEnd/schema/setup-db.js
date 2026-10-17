// One-time setup: runs schema/schema.sql against the database in .env
// (creates the streamflex database and its tables).
// Usage, in the backEnd folder:  npm run setup-db
import dotenv from "dotenv";
import fs from "node:fs";
import mysql from "mysql2/promise";
import { buildDbSslOptions } from "../src/utility/dbSsl.js";
dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: buildDbSslOptions(process.env),
  multipleStatements: true,
});

try {
  await connection.query(fs.readFileSync("schema/schema.sql", "utf8"));
  const [tables] = await connection.query("SHOW TABLES FROM streamflex");
  console.log("Done. Tables:", tables.map((row) => Object.values(row)[0]).join(", "));
} catch (error) {
  console.error("Setup failed:", error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
