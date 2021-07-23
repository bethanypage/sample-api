import supertest from 'supertest';
import {initExpressApp} from '../src/app'
import { Client} from 'pg';
import {getConnection} from '../src/db'
import {Application} from 'express';
const startDate = new Date(2020-12-12);
const endDate = new Date();

const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';
let app: Application;
async function seedData()
{
    const client = new Client({connectionString});
    await client.connect();
    await client.query("INSERT INTO Clients (cName) VALUES ('test name')  RETURNING *");
    await client.query("INSERT INTO Jobs (clientID,jobType,startDate,endDate) VALUES (1,'test one',$1,$2) RETURNING *", [startDate, endDate]);
    await client.end();
}
async function clearDB()
{
    const client = new Client({connectionString});
    await client.connect();
    await client.query("ROLLBACK");
    await client.query("TRUNCATE TABLE Clients");
    await client.query("TRUNCATE TABLE Jobs");
    await client.end();
} 
//called once before 
beforeAll(async () => {
    await seedData();
    app = initExpressApp();
    const client = getConnection();
})
afterAll(async () =>
{
    await clearDB();
    getConnection().end();
})

describe('Clients', () => 
{
    it.only('POST / - Add New Client', async () => 
    {
        const request = supertest(app);
        const response = await request.post("/api/client")
        .send({ cName: "Inserted Name"});
        expect(response.statusCode).toBe(200);
    
    });
    it('GET / - Return all Clients', async () => {

        const request = supertest(initExpressApp());
        const response = await request.get("/api/client");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect (response.body[1].id).toBe(2);
        expect(response.body[1].cname).toBe('Inserted Name');

     });
    it('PUT / - Update one Client', async () => {

        const request = supertest(initExpressApp());
        const response = await request.put("/api/client/1")
        .send({ cName: "Updated Name"});
        expect(response.statusCode).toBe(200);
        expect (response.body.id).toBe(1);
        expect(response.body.cname).toBe('Updated Name');
    
    
    });
    it('GET / - Return one Client', async () => {

        const request = supertest(initExpressApp());
        const response = await request.get("/api/client/2");
        expect(response.statusCode).toBe(200);
        expect (response.body.id).toBe(2);
        expect(response.body.cname).toBe('Inserted Name');

    
    });
   
});

describe('Jobs', () => 
{
    it('POST / - Add New Job', async () => 
    {
        const request = supertest(initExpressApp());
        const response = await request.post("/api/jobs")
        .send({
            clientID : "1",
            jobType : "insertedJob",
            startDate : "2017-12-12",
            endDate : "2018-12-12"
          });
        expect(response.statusCode).toBe(200);
    });
    it('GET / - Return all Jobs', async () => {

        const request = supertest(initExpressApp());
        const response = await request.get("/api/jobs");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);

     });
    it('PUT / - Update one Job', async () => {
        const sDate = new Date(2019-12-12)
        const eDate = new Date(2021-12-12)
        const request = supertest(initExpressApp());
        const response = await request.put("/api/jobs/1")
        .send({
            clientID : "2",
            jobType : "updatedJob",
            startDate : "2017-12-12",
            endDate : "2018-12-12"
          });
        expect(response.statusCode).toBe(200);    
    
    });
    it('GET / - Return one Job', async () => {

        const request = supertest(initExpressApp());
        const response = await request.get("/api/jobs/1");
        expect(response.statusCode).toBe(200);
        expect (response.body.id).toBe(1);
        expect(response.body.jobtype).toBe('updatedJob');
    });
   
});