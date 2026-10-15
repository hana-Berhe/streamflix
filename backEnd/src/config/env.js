/**
 * Single source of truth for configuration.
 *
 * Every environment variable is read and checked here, once, at startup.
 * The rest of the app imports `config` instead of touching process.env, so a
 * missing or malformed value fails fast with a clear message instead of
 * surfacing later as a confusing runtime error.
 */
import 'dotenv/config';

const problems = [];

const read = (name, { required = false, fallback } = {}) => {
  const value = process.env[name]?.trim();
  if (!value) {
    if (required) problems.push(`${name} is required`);
    return fallback;
  }
  return value;
};

const readInt = (name, fallback) => {
  const raw = read(name);
  if (raw === undefined) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    problems.push(`${name} must be a positive integer (got "${raw}")`);
    return fallback;
  }
  return value;
};

const nodeEnv = read('NODE_ENV', { fallback: 'development' });
const isProduction = nodeEnv === 'production';

const jwtSecret = read('JWT_SECRET', { required: true });
if (jwtSecret && isProduction && jwtSecret.length < 32) {
  problems.push('JWT_SECRET must be at least 32 characters in production');
}

const sameSite = read('COOKIE_SAMESITE', { fallback: 'lax' }).toLowerCase();
if (!['lax', 'strict', 'none'].includes(sameSite)) {
  problems.push(`COOKIE_SAMESITE must be lax, strict or none (got "${sameSite}")`);
}

const clientOrigins = read('CLIENT_ORIGIN', { fallback: 'http://localhost:5173' })
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const config = {
  env: nodeEnv,
  isProduction,
  port: readInt('PORT', 5000),
  clientOrigins,

  jwt: {
    secret: jwtSecret,
    expiresIn: '1h',
    maxAgeMs: 60 * 60 * 1000,
  },

  cookie: {
    sameSite,
    // Browsers reject SameSite=None cookies unless they are also Secure.
    secure: isProduction || sameSite === 'none',
  },

  db: {
    host: read('DB_HOST', { required: true }),
    port: readInt('DB_PORT', 3306),
    user: read('DB_USER', { required: true }),
    password: read('DB_PASSWORD', { fallback: '' }),
    database: read('DB_NAME', { required: true }),
    connectionLimit: readInt('DB_CONNECTION_LIMIT', 10),
  },

  gemini: {
    apiKey: read('GEMINI_API_KEY'),
    model: read('GEMINI_TEXT_MODEL', { fallback: 'gemini-3.5-flash-lite' }),
    timeoutMs: readInt('GEMINI_TIMEOUT_MS', 20000),
  },
};

if (problems.length) {
  // Thrown (not process.exit) so server.js decides how to report and exit.
  const error = new Error(`Invalid configuration:\n  - ${problems.join('\n  - ')}`);
  error.code = 'INVALID_CONFIG';
  throw error;
}

export default Object.freeze(config);
