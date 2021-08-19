import CSLogger from '@cloudsense/cs-logger';
import throng from 'throng';
import log4js from './log4js.json';

import { startupSystem } from './app';

CSLogger.configure(log4js);
const logger = CSLogger.getLogger('cs:startup');

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
