import config from '../config/env.js';

/**
 * Minimal structured logger.
 * Production: one JSON object per line, which log platforms (Render, Railway,
 * Datadog, CloudWatch) can parse and filter. Development: readable text.
 */
const write = (level, message, meta = {}) => {
  const entry = { time: new Date().toISOString(), level, message, ...meta };

  if (config.isProduction) {
    const line = JSON.stringify(entry);
    (level === 'error' ? console.error : console.log)(line);
    return;
  }

  const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  const print = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  print(`[${level}] ${message}${extras}`);
};

const logger = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};

export default logger;
