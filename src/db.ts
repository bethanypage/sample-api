import { Client } from "pg";

let client: Client 
const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';

export function getConnection():Client{
    
    if (client){
        return client;
    }
    client = new Client({connectionString});
    return client;
}