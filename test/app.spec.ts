import supertest from 'supertest';
import { Client } from 'pg';
import { Pool, PoolClient } from 'pg';
import { Application } from 'express';
import { PostgreSqlContainer, StartedPostgreSqlContainer, TestContainers } from 'testcontainers';
import fs from 'fs';
//Test constants
const startDate = new Date(2020 - 12 - 12);
const endDate = new Date();

let app: Application;
let container: StartedPostgreSqlContainer;

async function seedData(pool: Pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS clients(
      id SERIAL,
      name varchar(80),
      PRIMARY KEY(id)
    );
    `);
  //Running initial SQL file
  // const dbScript = fs.readFileSync('src/schema.sql').toString();
  // await client.query(dbScript);
  // //Adding additional test data
  // await client.query("INSERT INTO Clients (cName) VALUES ('test name')  RETURNING *");
  // await client.query("INSERT INTO Jobs (clientID,jobType,startDate,endDate) VALUES (1,'test one',$1,$2) RETURNING *", [
  //   startDate,
  //   endDate,
  // ]);
  //await client.end();
}

//called once before
beforeAll(async () => {
  //Start container
  container = await new PostgreSqlContainer().start();
  const connectionString = `postgres://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`;
  process.env.DB_CONN = connectionString;

  const { getPool } = await import('../src/db');
  const pool = getPool();
  const response = await pool.query('SELECT NOW()');
  console.log(response?.rows);
  await seedData(pool);

  //dynamic import to allow connection to be started
  const { initExpressApp } = await import('../src/app');
  app = await initExpressApp();
});
afterAll(async () => {
  console.log('starting after all');
  container.stop();
  console.log('container stopped');
  // try {
  //   await container.stop();
  // } catch (err) {
  //   if (err.statusCode === 304) {
  //     console.log('container stopped');
  //   } else {
  //     //console.log(err);
  //   }
  // }
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
    console.log('request');
    const response = await request.get('/api/client');
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    console.log(response.statusCode);
    // expect(response.body.length).toBe(2);
    //expect(response.body[1].id).toBe(2);
    //expect(response.body[1].cname).toBe('Inserted Name');
    //console.log(response.body[1].cname);
    console.log('get/ finished');
  });
});
