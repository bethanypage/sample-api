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

  //Creating database
  const dbScript = await fs.readFile(DB_SEED);
  logger.debug(`Loaded ${DB_SEED}`);

  await pool.query(dbScript.toString());
  logger.debug(`DB seed success.`);

  //Adding test data
  await pool.query("INSERT INTO Clients (cName) VALUES ('test name')  RETURNING *");
  await pool.query("INSERT INTO Jobs (clientID,jobType,startDate,endDate) VALUES (1,'test one',$1,$2) RETURNING *", [
    startDate,
    endDate,
  ]);
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
  it('POST / - Add New Client', async () => {
    const request = supertest(app);
    const response = await request.post('/api/client').send({ cName: 'Inserted Name' });
    expect(response.statusCode).toBe(200);
    //console.log('post/ finished');
  });

  it('GET / - Return all Clients', async () => {
    const request = supertest(app);
    const response = await request.get('/api/client');

    logger.debug('clients response:', { status: response.statusCode, headers: response.headers, payload: response.body });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[1].id).toBe(2);
    expect(response.body[1].cname).toBe('Inserted Name');
  });
  it('PUT / - Update one Client', async () => {
    const request = supertest(app);
    const response = await request.put('/api/client/1').send({ cName: 'Updated Name' });
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.cname).toBe('Updated Name');
  });
  it('GET / - Return one Client', async () => {
    const request = supertest(app);
    const response = await request.get('/api/client/2');
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(2);
    expect(response.body.cname).toBe('Inserted Name');
  });
});

describe('Jobs', () => {
  it('POST / - Add New Job', async () => {
    const request = supertest(app);
    const response = await request.post('/api/jobs').send({
      clientID: '1',
      jobType: 'insertedJob',
      startDate: '2017-12-12',
      endDate: '2018-12-12',
    });
    expect(response.statusCode).toBe(200);
  });
  it('GET / - Return all Jobs', async () => {
    const request = supertest(app);
    const response = await request.get('/api/jobs');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });
  it('PUT / - Update one Job', async () => {
    const sDate = new Date(2019 - 12 - 12);
    const eDate = new Date(2021 - 12 - 12);
    const request = supertest(app);
    const response = await request.put('/api/jobs/1').send({
      clientID: '2',
      jobType: 'updatedJob',
      startDate: '2017-12-12',
      endDate: '2018-12-12',
    });
    expect(response.statusCode).toBe(200);
  });
  it('GET / - Return one Job', async () => {
    const request = supertest(app);
    const response = await request.get('/api/jobs/1');
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.jobtype).toBe('updatedJob');
  });
});
