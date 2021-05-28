// TODO: create a one off script here that uses `pg` to load schema.sql and run it against the database
import {pool} from './db';
import fs from 'fs'; 

pool.connect();

const dbScript = fs.readFileSync('src/schema.sql').toString();
pool.query(dbScript, (err, res) => 
{
    if (err) throw err
    console.log(res);
});

