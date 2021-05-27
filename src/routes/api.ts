import express = require('express');
import {pool} from '../db';

const router = express.Router();

//Routes

// Read all clients
router.get('/client', async (req,res)=> {
    try {
        //console.log("Get");
        const clients = await pool.query("SELECT * FROM Clients");
        res.json(clients.rows);
        }catch(e) {
            console.error(e.message);
        }
})
//Read one client
router.get('/client/:id', async (req,res)=> {
    try {
        //console.log("Get");
        const id = req.params;
        const clients = await pool.query("SELECT FROM Clients WHERE id =$1", [id]);
        res.json(clients.rows[0]);
        }catch(e) {
            console.error(e.message);
        }
})
//Add new Client
router.post('/client', async (req,res) => {
    try {
    //console.log("POST");
    const cName = req.body.cName; 
    const newClient = await pool.query("INSERT INTO Clients cName VALUES $1 RETURNING *", [cName]);
    res.send("Successly added");
    
    }catch(e) {
        console.error(e.message);
    }
})
//Update Client
router.put('/client/:id',  async (req,res)=> {
    try {
        //console.log("Put");
        const id = req.params;
        const cName = req.body.cName;
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