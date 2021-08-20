import Logger from 'pino';
import throng from 'throng';

import { startupSystem } from './app';

const logger = Logger();

const throngOptions = {
  workers: process.env.WEB_CONCURRENCY ?? 1,
  lifetime: Infinity,
  master: startMaster,
  worker: startWorker,
};

throng(throngOptions);

function startMaster() {
  logger.info(`Master started, spanning ${throngOptions.workers} workers.`);
}

async function startWorker(id: number) {
  logger.info(`Starting worker ${id}...`);

  try {
    await startupSystem();
  } catch (err) {
    logger.fatal(`Error during worked ${id} startup`, err);
  }
}
