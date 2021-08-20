import type { Server } from 'http';
import type { Pool } from 'pg';

import Logger from 'pino';
import express from 'express';

import { getPool } from './db';
import { initRoutes } from './routes/api';
import { errorHandlingMiddleware } from './middleware';
import { initialiseLogging } from './middleware/context-logger';

const port = process.env.PORT ?? 3000;
let pool: Pool;
let server: Server;

export function initExpressApp() {
  const app = express();

  pool = getPool();
  const logger = Logger();

  app.use(express.json());
  app.use(initialiseLogging());
  app.use('/api', initRoutes());

  app.use(errorHandlingMiddleware());

  attachShutdownHandles();

  return app;
}

export async function startupSystem(): Promise<void> {
  const logger = Logger();

  server = initExpressApp().listen(port, () => {
    logger.info(`Listening on port: ${port}`);
  });
}

function attachShutdownHandles() {
  const logger = Logger();

  process.on('exit', (code) => {
    logger.info(`Application exiting with code ${code}`);
  });

  process.once('SIGINT', () => systemShutdown(logger, 'SIGINT'));
  process.once('SIGTERM', () => systemShutdown(logger, 'SIGTERM'));
}

export async function systemShutdown(logger: any, code?: string): Promise<any> {
  if (code) logger.warn(`${code} event reached. Application closing.`);
  else logger.warn(`Application closing.`);

  function stopServer() {
    return new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  try {
    //.close() -> .end()
    await Promise.all([pool.end(), stopServer()]);

    process.exit(0);
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}
