import mysql from 'mysql2/promise';
import config from './env.js';

/**
 * Connection pool shared by all models.
 * Queries use placeholders (?) everywhere, so values are always escaped by the driver.
 */
const db = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  connectionLimit: config.db.connectionLimit,
  waitForConnections: true,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: 'Z', // store and read timestamps as UTC
  enableKeepAlive: true,
});

export const pingDatabase = async () => {
  await db.query('SELECT 1');
};

export default db;
