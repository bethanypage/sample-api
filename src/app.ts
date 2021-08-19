import type { Server } from 'http';
import type { Pool } from 'pg';

import CSLogger, { Logger } from '@cloudsense/cs-logger';
import express from 'express';

import log4js from './log4js.json';

import { getPool } from './db';
import { initRoutes } from './routes/api';
import { errorHandlingMiddleware } from './middleware';

CSLogger.configure(log4js);

const port = process.env.PORT ?? 3000;

let pool: Pool;
let server: Server;

export function initExpressApp() {
  const app = express();

  pool = getPool();

  app.use(express.json());
  app.use(CSLogger.initCsExpressLogging());

  app.use('/api', initRoutes());

  app.use(errorHandlingMiddleware());

  attachShutdownHandles();

  return app;
}

export async function startupSystem(): Promise<void> {
  const logger = CSLogger.getLogger('cs:startup');

  server = initExpressApp().listen(port, () => {
    logger.info(`Listening on port: ${port}`);
  });
}

function attachShutdownHandles() {
  const logger = CSLogger.getLogger('cs:shutdown');

  process.on('exit', (code) => {
    logger.info(`Application exiting with code ${code}`);
  });

  process.once('SIGINT', () => systemShutdown(logger, 'SIGINT'));
  process.once('SIGTERM', () => systemShutdown(logger, 'SIGTERM'));
}

export async function systemShutdown(logger: Logger, code?: string): Promise<any> {
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
