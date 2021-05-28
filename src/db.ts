import { Pool } from "pg";

//Connection strings usually have the format:
//postgres://username:password@host:port
//
//So you could get in from environment variable in two ways:
//
// const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';
//
// OR
//
// const db_username = process.env.DB_USERNAME ?? 'postgres';
// const db_password = process.env.DB_PASSWORD ?? 'postgres';
// const db_host = process.env.DB_HOST ?? 'localhost';
// const db_port = process.env.DB_PORT ?? 5432;
//

export const pool = new Pool(
{
    //replace with connection string ayo?
    user: "postgres",
    password: 'postgres',
    database: 'simple-api',
    host: "localhost",
    port: 5432 //standard postgresql port

});




