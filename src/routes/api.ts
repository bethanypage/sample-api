import express, { json }  from 'express';
import {pool} from '../db';

const router = express.Router();

router.use(express.json());

//Routes

//--------------------Client-------------------


// Read all clients
router.get('/client', async (req,res)=> {
    try {
        const clients = await pool.query("SELECT * FROM Clients");
        res.json(clients.rows);
        }catch(e) {
            console.error(e.message);
        }
})
//Read one client
router.get('/client/:id', async (req,res)=> {
    const id = req.params.id;
    try {
        const clients = await pool.query("SELECT * FROM Clients WHERE id =$1", [id]);
        res.json(clients.rows[0]);
        }catch(e) {
            console.error(e.message);
        }
})
//Add new Client
router.post('/client', async (req,res) => {
    try {
    //console.log("POST");
    var cName = req.body.cName; 
    console.log(cName);
    const clients = await pool.query("INSERT INTO Clients (cname) VALUES ($1) RETURNING *", [cName]);
    var th = clients.rows[0];
    console.log(th);
    res.json(clients.rows[0]);

    
    }catch(e) {
        console.error(e.message);
    }
})
//Update Client
router.put('/client/:id',  async (req,res)=> {
    const id = req.params.id;
    const cName = req.body.cName;
    try {
        //console.log("Put");
        const clients = await pool.query("UPDATE Clients SET cName = $1 WHERE id = $2", [cName, id]);
        res.json(clients.rows[0]);
        }catch(e) {
            console.error(e.message);
        }
    
})
//Delete

//--------------------Jobs-------------------
//Read all jobs 
router.get('/jobs', async (req,res)=> {
    try {
        const jobs = await pool.query("SELECT * FROM Jobs");
        res.json(jobs.rows);
        }catch(e) {
            console.error(e.message);
        }
})

//Read one job
router.get('/jobs/:id', async (req,res)=> {
    const id = req.params.id;
    try {
        const jobs = await pool.query("SELECT * FROM Jobs WHERE id =$1", [id]);
        res.json(jobs.rows[0]);
        }catch(e) {
            console.error(e.message);
        }
})

//Add new job
router.post('/jobs', async (req,res) => {

    const clientID = req.body.clientID; 
    const jobType = req.body.jobType;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
    await pool.query("INSERT INTO Jobs (clientID,jobType,startDate,endDate) VALUES ($1,$2,$3,$4) RETURNING *", [clientID, jobType, startDate, endDate]);
    res.send("Successly added");
    
    }catch(e) {
        console.error(e.message);
    }
})
//Update job
router.put('/jobs/:id', async (req,res) => {
    const id = req.params.id;    
    const clientID = req.body.clientID; 
    const jobType = req.body.jobType;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
    await pool.query("UPDATE Jobs SET clientID = $1, jobType = $2, startDate = $3, endDate = $4 WHERE id = $5", [clientID, jobType, startDate, endDate, id]);
    res.send("Successly added");
    
    }catch(e) {
        console.error(e.message);
    }
})
//Delete

export default router 