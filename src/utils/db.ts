import { DB } from '@/database/types';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import parseDatabaseUrl from 'ts-parse-database-url';

const { database, host, user, password, port } = parseDatabaseUrl(
  process.env.DATABASE_URL || '',
);

const dialect = new PostgresDialect({
  pool: new Pool({
    database,
    host,
    user,
    password,
    port,
  }),
});

export const db = new Kysely<DB>({
  dialect,
});
