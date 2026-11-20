import pg from "pg";

const { Pool } = pg;

export const dbConfig = {
  host: process.env.POSTGRES_HOST ?? "postgres",
  port: Number(process.env.POSTGRES_PORT ?? 5434),
  database: process.env.POSTGRES_DB ?? "postgres",
  user: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "admin",
};

export const schema = process.env.POSTGRES_SCHEMA ?? "connectors";
export const table = "livenessprobe_records";
export const failedTable = "livenessprobe_failed_records";
export const deletedTable = "livenessprobe_deleted_records";
export const profilesTable = "livenessprobe_profiles";

export const pool = new Pool(dbConfig);

export function profileRecordsTableName(profileId: number): string {
  if (!Number.isInteger(profileId) || profileId <= 0) {
    throw new Error(`Invalid profile id: ${profileId}`);
  }
  return `${table}_${profileId}`;
}

export async function ensureProfileRecordsTable(profileId: number): Promise<string> {
  const tableName = profileRecordsTableName(profileId);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${tableName} (
      id BIGSERIAL PRIMARY KEY,
      snow_name TEXT NOT NULL UNIQUE,
      health_url TEXT NOT NULL,
      snow_host_url TEXT NOT NULL,
      failure_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  return tableName;
}

async function ensureIdPrimaryKey(tableName: string): Promise<void> {
  await pool.query(`ALTER TABLE ${schema}.${tableName} ADD COLUMN IF NOT EXISTS id BIGSERIAL`);

  await pool.query(`
    DO $$
    DECLARE
      pk_name text;
    BEGIN
      SELECT c.conname INTO pk_name
      FROM pg_constraint c
      JOIN pg_class t ON t.oid = c.conrelid
      JOIN pg_namespace n ON n.oid = t.relnamespace
      JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey) AND NOT a.attisdropped
      WHERE n.nspname = '${schema}'
        AND t.relname = '${tableName}'
        AND c.contype = 'p'
        AND a.attname = 'snow_name';

      IF pk_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE %I.%I DROP CONSTRAINT %I', '${schema}', '${tableName}', pk_name);
        EXECUTE format('ALTER TABLE %I.%I ADD PRIMARY KEY (id)', '${schema}', '${tableName}');
      END IF;
    END $$;
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS ${tableName}_snow_name_uidx
    ON ${schema}.${tableName} (snow_name)
  `);
}

export async function initDb(): Promise<void> {
  await pool.query(`CREATE SCHEMA IF NOT EXISTS ${schema}`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${table} (
      id BIGSERIAL PRIMARY KEY,
      snow_name TEXT NOT NULL UNIQUE,
      health_url TEXT NOT NULL,
      snow_host_url TEXT NOT NULL,
      failure_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    ALTER TABLE ${schema}.${table}
    ADD COLUMN IF NOT EXISTS failure_count INTEGER NOT NULL DEFAULT 0
  `);

  await ensureIdPrimaryKey(table);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${failedTable} (
      id BIGSERIAL PRIMARY KEY,
      snow_name TEXT NOT NULL UNIQUE,
      health_url TEXT NOT NULL,
      snow_host_url TEXT NOT NULL,
      failure_count INTEGER NOT NULL,
      last_error TEXT NOT NULL,
      failed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ
    )
  `);

  await ensureIdPrimaryKey(failedTable);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${deletedTable} (
      id BIGSERIAL PRIMARY KEY,
      snow_name TEXT NOT NULL UNIQUE,
      health_url TEXT NOT NULL,
      snow_host_url TEXT NOT NULL,
      failure_count INTEGER NOT NULL DEFAULT 0,
      deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ
    )
  `);

  await ensureIdPrimaryKey(deletedTable);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${schema}.${profilesTable} (
      id BIGSERIAL PRIMARY KEY,
      snow_name TEXT,
      actor_id TEXT NOT NULL,
      git_type TEXT NOT NULL,
      UNIQUE (actor_id, git_type)
    )
  `);

  await pool.query(`
    ALTER TABLE ${schema}.${profilesTable}
    ADD COLUMN IF NOT EXISTS snow_name TEXT
  `);

  await pool.query(`DROP INDEX IF EXISTS ${schema}.${profilesTable}_snow_name_uidx`);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS ${profilesTable}_actor_git_uidx
    ON ${schema}.${profilesTable} (actor_id, git_type)
  `);

  console.log(`[db] Connected — schema "${schema}", tables ${table}, ${failedTable}, ${deletedTable}, ${profilesTable} ready`);
}
