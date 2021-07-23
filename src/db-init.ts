import {Pool} from 'pg';
import fs from 'fs'; 

const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';


async function main()
{
    const pool = new Pool({connectionString});
    const client = await pool.connect();

    const dbScript = fs.readFileSync('src/schema.sql').toString();

    const response = await client.query(dbScript)

    client.release();
    await pool.end();
    console.log("pool closed");
}

main()
.catch(console.error)
