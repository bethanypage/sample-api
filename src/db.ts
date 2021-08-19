//import { Client } from 'pg';
import { Pool, PoolClient } from 'pg';

let pool: Pool;
//let client: Client;
const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';

//export const pool = new Pool({ connectionString });
export function getPool() {
  if (pool) {
    return pool;
  } else {
    pool = new Pool({ connectionString });
    return pool;
  }
}
export function getConnection(): Promise<PoolClient> {
  return pool.connect();
}
