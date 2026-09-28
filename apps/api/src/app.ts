import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error.middleware.js';
import { healthRouter } from './modules/health/health.routes.js';
import { repairsRouter } from './modules/repairs/repairs.routes.js';
import { devicesRouter } from './modules/devices/devices.routes.js';
import { customersRouter } from './modules/customers/customers.routes.js';
import { componentsRouter } from './modules/components/components.routes.js';
import { intelligenceRouter } from './modules/intelligence/intelligence.routes.js';
import { analyticsRouter } from './modules/analytics/analytics.routes.js';

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

  // Mount root informational route
  app.get('/', (_req, res) => {
    res.status(200).json({
      name: 'Fixiq Repair Intelligence API',
      status: 'healthy',
      version: '0.1.0',
      database: 'PostgreSQL Live Connected',
      endpoints: [
        '/api/health',
        '/api/repairs',
        '/api/devices',
        '/api/customers',
        '/api/components',
        '/api/patterns',
        '/api/analytics',
      ],
    });
  });

  // Mount API modules
  app.use('/api', healthRouter);
  app.use('/api', repairsRouter);
  app.use('/api', devicesRouter);
  app.use('/api', customersRouter);
  app.use('/api', componentsRouter);
  app.use('/api', intelligenceRouter);
  app.use('/api', analyticsRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
