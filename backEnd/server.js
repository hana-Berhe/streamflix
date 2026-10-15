/**
 * Process entry point: load config, start HTTP, and shut down cleanly.
 * Config is imported dynamically so a configuration error can be reported
 * clearly instead of as a stack trace.
 */
let config;
try {
  ({ default: config } = await import('./src/config/env.js'));
} catch (error) {
  console.error(error.code === 'INVALID_CONFIG' ? error.message : error);
  console.error('Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

const { default: app } = await import('./src/app.js');
const { default: db } = await import('./src/config/db.js');
const { default: logger } = await import('./src/utils/logger.js');

const server = app.listen(config.port, () => {
  logger.info(`Server listening on port ${config.port}`, { env: config.env });
  if (!config.gemini.apiKey) {
    logger.warn('GEMINI_API_KEY is not set: AI suggestions will use the TMDB fallback.');
  }
});

/**
 * On SIGTERM (sent by hosts when redeploying) or Ctrl+C: stop accepting
 * connections, let in-flight requests finish, close the DB pool, then exit.
 * A timer forces exit if something hangs.
 */
let shuttingDown = false;
const shutdown = (signal, exitCode = 0) => {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`${signal} received, shutting down`);

  const forceExit = setTimeout(() => {
    logger.error('Graceful shutdown timed out, forcing exit');
    process.exit(1);
  }, 10000);
  forceExit.unref();

  server.close(async () => {
    try {
      await db.end();
    } catch (error) {
      logger.error('Error closing database pool', { error: error.message });
    }
    process.exit(exitCode);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// A bug that escaped every handler: log it and restart cleanly rather than run in an unknown state.
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: reason?.stack || String(reason) });
  shutdown('unhandledRejection', 1);
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { stack: error.stack });
  shutdown('uncaughtException', 1);
});
