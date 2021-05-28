import express, { json }  from 'express';
import {pool} from '../db';

const router = express.Router();

router.use(express.json());

//Routes

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
    await pool.query("INSERT INTO Clients (cname) VALUES ($1) RETURNING *", [cName]);
    res.send("Successly added");
    
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

//Read all jobs 

//Read one job

//Add new job

//Update job

//Delete

export = router 