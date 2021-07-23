import express, { json }  from 'express';
//import {Client} from 'pg';
import {getConnection} from '../db';

export function initRoutes(){

    const client = getConnection();
    const router = express.Router();

    router.use(express.json());

    
    //--------------------Client-------------------
    // Read all clients
    router.get('/client', async (req,res)=> {

        await client.connect();
        try {
            const result = await client.query("SELECT * FROM Clients");
            res.json(result.rows);
            }catch(e) {
                console.error(e.message);
            }
        await client.end();
        }
    )
    //Read one client
    router.get('/client/:id', async (req,res)=> {
        const id = req.params.id;
        await client.connect();
        try {
            const result = await client.query("SELECT * FROM Clients WHERE id =$1", [id]);
            res.json(result.rows[0]);
            }catch(e) {
                console.error(e.message);
            }
            await client.end();
        })
    //Add new Client
    router.post('/client', async (req,res) => {
        await client.connect();
        try {
        var cName = req.body.cName; 
        const result = await client.query("INSERT INTO Clients (cname) VALUES ($1) RETURNING *", [cName]);
        res.json(result.rows[0]);
        }catch(e) {
            console.error(e.message);
        }
        await client.end();

    })
    //Update Client
    router.put('/client/:id',  async (req,res)=> {
        await client.connect(); 
        const id = req.params.id;
        const cName = req.body.cName;
        try {
            //console.log("Put");
            const result = await client.query("UPDATE Clients SET cName = $1 WHERE id = $2 RETURNING *", [cName, id]);
            res.json(result.rows[0]);
            }catch(e) {
                console.error(e.message);
            }
        await client.end();        
    })
    //Delete

    //--------------------Jobs-------------------
    //Read all jobs 
    router.get('/jobs', async (req,res)=> {
        await client.connect();
        try {
            const jobs = await client.query("SELECT * FROM Jobs");
            res.json(jobs.rows);
            }catch(e) {
                console.error(e.message);
            }
        await client.end();
    })

    //Read one job
    router.get('/jobs/:id', async (req,res)=> {
        await client.connect();
        const id = req.params.id;
        try {
            const jobs = await client.query("SELECT * FROM Jobs WHERE id =$1", [id]);
            res.json(jobs.rows[0]);
            }catch(e) {
                console.error(e.message);
            }
            await client.end();
    })

    //Add new job
    router.post('/jobs', async (req,res) => {
        await client.connect();
        const clientID = req.body.clientID; 
        const jobType = req.body.jobType;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        try {
        await client.query("INSERT INTO Jobs (clientID,jobType,startDate,endDate) VALUES ($1,$2,$3,$4) RETURNING *", [clientID, jobType, startDate, endDate]);
        res.send("Successly added");
    
        }catch(e) {
            console.error(e.message);
        }
        await client.end();
    })
    //Update job
    router.put('/jobs/:id', async (req,res) => {
        await client.connect();
        const id = req.params.id;    
        const clientID = req.body.clientID; 
        const jobType = req.body.jobType;
        const startDate = req.body.startDate;
        const endDate = req.body.endDate;
        try {
        await client.query("UPDATE Jobs SET clientID = $1, jobType = $2, startDate = $3, endDate = $4 WHERE id = $5", [clientID, jobType, startDate, endDate, id]);
        res.send("Successly added");
        
        }catch(e) {
            console.error(e.message);
        }
        await client.end();
    })
    //Delete
    return router;
}
