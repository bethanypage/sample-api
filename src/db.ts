const Pool = require("pg")

export const pool = new Pool(
{
    //replace with connection string ayo?
    user: "postgres",
    password: 'postgres',
    database: 'simple-api',
    host: "localhost",
    port: 5432 //standard postgresql port

});




