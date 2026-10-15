/**
 * One-time setup: runs db/schema.sql against the database in .env
 * (creates the streamflex database and its tables).
 *
 * Usage, in the backEnd folder:  node scripts/setup-db.js
 * For Aiven, put ca.pem in the backEnd folder (or set DB_SSL_CA in .env).
 */
import 'dotenv/config';
import fs from 'node:fs';
import mysql from 'mysql2/promise';

const ca = fs.existsSync('ca.pem')
  ? fs.readFileSync('ca.pem', 'utf8')
  : process.env.DB_SSL_CA?.replace(/\\n/g, '\n');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: ca ? { ca, rejectUnauthorized: true } : undefined,
  multipleStatements: true,
});

try {
  await connection.query(fs.readFileSync('db/schema.sql', 'utf8'));
  const [tables] = await connection.query('SHOW TABLES FROM streamflex');
  console.log('Done. Tables:', tables.map((row) => Object.values(row)[0]).join(', '));
} catch (error) {
  console.error('Failed:', error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
