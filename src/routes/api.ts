import express, { json } from 'express';
import { getPool } from '../db';
import Logger from 'pino';

export function initRoutes() {
  const pool = getPool();
  const router = express.Router();

  //--------------------Client-------------------
  // Read all clients
  router.get('/client', async (req, res, next) => {
    try {
      const logger = Logger();
      logger.info('Anything');
      const result = await pool.query('SELECT * FROM clients');
      req.log.info('a');
      res.json(result.rows);
    } catch (e) {
      next(e);
    }
  });
  //Read one client
  router.get('/client/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await pool.query('SELECT * FROM Clients WHERE id =$1', [id]);
      res.json(result.rows[0]);
    } catch (e) {
      next(e);
    }
  });
  //Add new Client
  router.post('/client', async (req, res, next) => {
    try {
      var cName = req.body.cName;
      const result = await pool.query('INSERT INTO Clients (cname) VALUES ($1) RETURNING *', [cName]);
      res.json(result.rows[0]);
    } catch (e) {
      next(e);
    }
  });
  //Update Client
  router.put('/client/:id', async (req, res, next) => {
    const id = req.params.id;
    const cName = req.body.cName;
    try {
      //console.log("Put");
      const result = await pool.query('UPDATE Clients SET cName = $1 WHERE id = $2 RETURNING *', [cName, id]);
      res.json(result.rows[0]);
    } catch (e) {
      next(e);
    }
  });
  //Delete

  //--------------------Jobs-------------------
  //Read all jobs
  router.get('/jobs', async (req, res, next) => {
    try {
      const jobs = await pool.query('SELECT * FROM Jobs');
      res.json(jobs.rows);
    } catch (e) {
      next(e);
    }
  });

  //Read one job
  router.get('/jobs/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
      const jobs = await pool.query('SELECT * FROM Jobs WHERE id =$1', [id]);
      res.json(jobs.rows[0]);
    } catch (e) {
      next(e);
    }
  });

  //Add new job
  router.post('/jobs', async (req, res, next) => {
    const clientID = req.body.clientID;
    const jobType = req.body.jobType;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
      await pool.query('INSERT INTO Jobs (clientID,jobType,startDate,endDate) VALUES ($1,$2,$3,$4) RETURNING *', [
        clientID,
        jobType,
        startDate,
        endDate,
      ]);
      res.send('Successly added');
    } catch (e) {
      next(e);
    }
  });
  //Update job
  router.put('/jobs/:id', async (req, res, next) => {
    const id = req.params.id;
    const clientID = req.body.clientID;
    const jobType = req.body.jobType;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    try {
      await pool.query('UPDATE Jobs SET clientID = $1, jobType = $2, startDate = $3, endDate = $4 WHERE id = $5', [
        clientID,
        jobType,
        startDate,
        endDate,
        id,
      ]);
      res.send('Successly added');
    } catch (e) {
      next(e);
    }
  });
  //Delete
  return router;
}
