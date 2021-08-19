import { Logger } from '@cloudsense/cs-logger';
import { Pool } from 'pg';

let pool: Pool;

export function getPool(logger?: Logger) {
  const connectionString = process.env.DB_CONN ?? 'postgres://postgres:postgres@localhost:5432';

  if (!pool) {
    pool = new Pool({
      connectionString,
      log: (query: string, time: number) => logger?.debug(`Query ${query}, took ${time}ms.`),
    });
  }

  return pool;
}
