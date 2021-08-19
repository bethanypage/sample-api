import express from 'express';
//import { initRoutes } from './routes/api';
import { getPool } from './db';
import { Pool } from 'pg';
import log4js from './log4js.json';
import CSLogger from '@cloudsense/cs-logger';

CSLogger.configure(log4js);
let pool: Pool;

export async function initExpressApp(): Promise<express.Application> {
  const app = express();
  pool = getPool();

  app.use(express.json);
  app.use(CSLogger.initCsExpressLogging());
  //app.use('/api', initRoutes());
  app.get('/', (req, res) => {
    res.send({ message: 'OK' });
  });
  process.on('exit', (code) => {
    console.log(`Application exiting with code ${code}`);
  });

  process.once('SIGINT', () => systemShutdown('SIGINT'));
  process.once('SIGTERM', () => systemShutdown('SIGTERM'));
  return app;
}

export async function systemShutdown(code?: string): Promise<any> {
  if (code) console.log(`${code} event reached. Application closing.`);
  else console.log(`Application closing.`);
  try {
    //.close() -> .end()
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.log(err.toString());
    process.exit(1);
  }
}
