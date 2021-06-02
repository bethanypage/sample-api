import supertest from 'supertest';
import {initExpressApp} from '../src/app'

import { Client } from 'pg';
import { Pool } from 'pg';
const startDate = new Date(2020-12-12);
const endDate = new Date();

const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';

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

    await client.query("DELETE FROM clients");
    await client.query("DELETE FROM jobs");

    await client.end();
}
//called once before 
beforeAll(async () => {
    await seedData();
})
afterAll(async () =>
{
    await clearDB();

})

describe('Clients', () => 
{

    it('POST / - Add New Client', async () => 
    {
        const request = supertest(initExpressApp());
        const response = await request.post("/api/client")
        .send({ cName: "Inserted Name"});
        expect(response.statusCode).toBe(200);


    });
    it('GET / - Return all Clients', async () => {

        const request = supertest(initExpressApp());
        const response = await request.get("/api/client");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
        expect (response.body[0].id).toBe(1);
        expect(response.body[0].cname).toBe('test name');

    })
    it('GET / - Return one Client', async () => {

        const request = supertest(initExpressApp());
        const response = await request.get("/api/client/2");
        console.log(response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect (response.body[0].id).toBe(2);
        expect(response.body[0].cname).toBe('Inserted Name');

    
    });
   
});
