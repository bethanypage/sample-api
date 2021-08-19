import path from 'path';
import { promises as fs } from 'fs';
import { Pool } from 'pg';

const DB_SEED = path.resolve(__dirname, './init.sql');
const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';

async function main() {
  const pool = new Pool({ connectionString });

  const dbScript = await fs.readFile(DB_SEED);
  console.info(`Loaded ${DB_SEED}`);

  await pool.query(dbScript.toString());
  console.log('Run initialisation scripts. Cleaning up...');

  await pool.end();
  console.info('Cleanup complete. Success.');
}

main().catch(console.error);
