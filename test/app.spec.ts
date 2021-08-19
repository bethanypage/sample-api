import CSLogger from '@cloudsense/cs-logger';
import log4js from '../src/log4js.json';

import path from 'path';
import { promises as fs } from 'fs';
import supertest from 'supertest';

import { Pool } from 'pg';
import { Application } from 'express';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from 'testcontainers';

//Test constants
const DB_SEED = path.resolve(__dirname, '..', 'scripts', 'init.sql');

CSLogger.configure(log4js);
const logger = CSLogger.getLogger('cs:test');

const startDate = new Date(2020 - 12 - 12);
const endDate = new Date();

let app: Application;
let pool: Pool;
let container: StartedPostgreSqlContainer;

function getConnectionString(container: StartedPostgreSqlContainer) {
  return `postgres://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`;
}

async function seedData(pool: Pool) {
  logger.debug('Seeding test database');

  const dbScript = await fs.readFile(DB_SEED);
  logger.debug(`Loaded ${DB_SEED}`);

  await pool.query(dbScript.toString());
  logger.debug(`DB seed success.`);
}

//called once before
beforeAll(async () => {
  logger.info('Starting PostgreSQL container');
  container = await new PostgreSqlContainer().start();

  process.env.DB_CONN = getConnectionString(container);

  // Important to set the environment variables before importing src code.
  const { getPool } = await import('../src/db');
  pool = getPool();

  // Seed the database before doing any tests.
  await seedData(pool);

  // Create and initialise the express application.
  const { initExpressApp } = await import('../src/app');
  app = initExpressApp();
});

afterAll(async () => {
  await pool.end();
  logger.info("Pool's closed. Lifeguard is off duty.");

  await container.stop();
  logger.info('PostgreSQL container stopped');
});

describe('Clients', () => {
  // it('POST / - Add New Client', async () => {
  //   const request = supertest(app);
  //   const response = await request.post('/api/client').send({ cName: 'Inserted Name' });
  //   expect(response.statusCode).toBe(200);
  //   console.log('post/ finished');
  // });

  it('GET / - Return all Clients', async () => {
    const request = supertest(app);
    const response = await request.get('/api/client');

    logger.debug('clients response:', { status: response.statusCode, headers: response.headers, payload: response.body });
    // expect(response.statusCode).toBe(200);
    // console.log(response.statusCode);
    // // expect(response.body.length).toBe(2);
    // //expect(response.body[1].id).toBe(2);
    // //expect(response.body[1].cname).toBe('Inserted Name');
    // //console.log(response.body[1].cname);
  });
});
