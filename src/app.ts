import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { env } from './config/env';

export function createApp(): Application {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', routes);

  app.use(errorMiddleware);

  return app;
}