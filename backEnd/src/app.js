import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import config from './config/env.js';
import { pingDatabase } from './config/db.js';
import requestId from './middleware/requestId.middleware.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

import authRoutes from './api/auth/auth.routes.js';
import userRoutes from './api/users/user.routes.js';
import myListRoutes from './api/myList/myList.routes.js';
import ratingRoutes from './api/ratings/rating.routes.js';
import aiRoutes from './api/ai/ai.routes.js';

const app = express();

// Behind a host/load balancer (Render, Railway, Nginx): trust its X-Forwarded-* headers
// so req.ip (rate limiting) and secure cookies work correctly.
app.set('trust proxy', 1);
app.disable('x-powered-by');

// ---- Request pipeline (order matters) ----
app.use(requestId);
app.use(helmet());
app.use(
  cors({
    origin: config.clientOrigins,
    credentials: true, // allow the auth cookie cross-origin
  })
);

morgan.token('id', (req) => req.id);
app.use(
  morgan(
    config.isProduction
      ? ':id :remote-addr ":method :url" :status :res[content-length] - :response-time ms'
      : 'dev'
  )
);

app.use(express.json({ limit: '20kb' }));
app.use(cookieParser());

// ---- Health checks (for the hosting platform / uptime monitor) ----
// Liveness: the process is up.
app.get('/health', (req, res) => res.json({ status: 'ok' }));
// Readiness: the process can actually serve requests (database reachable).
app.get('/health/ready', async (req, res) => {
  try {
    await pingDatabase();
    res.json({ status: 'ok', database: 'up' });
  } catch {
    res.status(503).json({ status: 'unavailable', database: 'down' });
  }
});

// ---- API ----
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/my-list', myListRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/ai', aiRoutes);

// ---- Errors (must be last) ----
app.use(notFound);
app.use(errorHandler);

export default app;
