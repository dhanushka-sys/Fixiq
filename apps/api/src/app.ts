import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { healthRouter } from './modules/health/health.routes.js';

export function createApp(): Application {
  const app = express();

  // Security & baseline middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());

  // Mount routes
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'Fixiq Repair Intelligence API',
      status: 'healthy',
      version: '0.1.0',
      healthEndpoint: '/api/health',
    });
  });

  app.use('/api', healthRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
