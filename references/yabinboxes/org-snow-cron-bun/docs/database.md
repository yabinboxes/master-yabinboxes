# Database

Queue records are stored in PostgreSQL. The app requires a working database connection at startup.

## Connection

Defined in `src/db.ts`:

```typescript
export const dbConfig = {
  host: process.env.POSTGRES_HOST ?? "postgres",
  port: Number(process.env.POSTGRES_PORT ?? 5434),
  database: process.env.POSTGRES_DB ?? "postgres",
  user: process.env.POSTGRES_USER ?? "postgres",
  password: process.env.POSTGRES_PASSWORD ?? "admin",
};
```

A connection pool (`pg.Pool`) is created at module load and shared across the app.

## Environment variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `POSTGRES_HOST` | `postgres` | Database hostname |
| `POSTGRES_PORT` | `5434` | Database port |
| `POSTGRES_DB` | `postgres` | Database name |
| `POSTGRES_USER` | `postgres` | Username |
| `POSTGRES_PASSWORD` | `admin` | Password |
| `POSTGRES_SCHEMA` | `connectors` | Schema for the records tables |

## Schema initialization

On startup, `initDb()` creates:

- Schema `connectors`
- Table `connectors.livenessprobe_records` (active probes)
- Table `connectors.livenessprobe_failed_records` (probes removed after repeated failures)
- Table `connectors.livenessprobe_deleted_records` (probes removed via API)
- Column `failure_count` on active records (via `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`)

## Table: `connectors.livenessprobe_records`

Active liveness probes polled by the cron job.

| Column | Type | Description |
|--------|------|-------------|
| `snow_name` | TEXT (PK) | Maps to API field `snowName` |
| `health_url` | TEXT | Maps to API field `healthUrl` |
| `snow_host_url` | TEXT | Maps to API field `snowHostUrl` |
| `failure_count` | INTEGER | Consecutive network failures on `healthUrl` (default `0`) |
| `created_at` | TIMESTAMPTZ | Set on first insert |
| `updated_at` | TIMESTAMPTZ | Updated on each upsert or failure count change |

## Table: `connectors.livenessprobe_failed_records`

Probes moved here after more than 10 consecutive network failures on `healthUrl`. See [processRecord](process-record.md).

| Column | Type | Description |
|--------|------|-------------|
| `snow_name` | TEXT (PK) | Probe identifier |
| `health_url` | TEXT | Last known health URL |
| `snow_host_url` | TEXT | Last known host URL |
| `failure_count` | INTEGER | Failure count at time of removal |
| `last_error` | TEXT | Error message from the final failed health check |
| `failed_at` | TIMESTAMPTZ | When the record was moved to this table |
| `created_at` | TIMESTAMPTZ | Original `created_at` from active table |
| `updated_at` | TIMESTAMPTZ | Last `updated_at` from active table |

## Table: `connectors.livenessprobe_deleted_records`

Probes removed manually via `POST /delete-record-from-queue`.

| Column | Type | Description |
|--------|------|-------------|
| `snow_name` | TEXT (PK) | Probe identifier |
| `health_url` | TEXT | Last known health URL |
| `snow_host_url` | TEXT | Last known host URL |
| `failure_count` | INTEGER | Failure count at time of deletion |
| `deleted_at` | TIMESTAMPTZ | When the record was deleted |
| `created_at` | TIMESTAMPTZ | Original `created_at` from active table |
| `updated_at` | TIMESTAMPTZ | Last `updated_at` from active table |

## API ↔ database mapping

| API field (`POST /queue`) | Database column |
|---------------------------|-----------------|
| `snowName` | `snow_name` |
| `healthUrl` | `health_url` |
| `snowHostUrl` | `snow_host_url` |

## Upsert logic

`InputQueue.upsert()` in `src/queue.ts`:

1. Checks if `snow_name` already exists in the active table
2. Deletes any matching row from `livenessprobe_failed_records` and `livenessprobe_deleted_records` (re-registration)
3. Runs `INSERT ... ON CONFLICT (snow_name) DO UPDATE` with `failure_count = 0`
4. Returns `{ action: "inserted" }` or `{ action: "updated" }`

## Manual deletion

`InputQueue.deleteFromQueue()` via `POST /delete-record-from-queue`:

1. Loads the row from `livenessprobe_records` by `snow_name`
2. Inserts/updates `livenessprobe_deleted_records`
3. Deletes the row from `livenessprobe_records`

Runs in a single database transaction. Returns `null` if the record is not found.

## Failure removal

When `processRecord` increments `failure_count` past `10` (`MAX_HEALTH_FAILURES`):

1. Row is inserted/updated in `livenessprobe_failed_records`
2. Row is deleted from `livenessprobe_records`

This runs in a single database transaction.

## Querying manually

Active probes:

```sql
SELECT snow_name, health_url, snow_host_url, failure_count, created_at, updated_at
FROM connectors.livenessprobe_records
ORDER BY snow_name;
```

Failed probes:

```sql
SELECT snow_name, health_url, snow_host_url, failure_count, last_error, failed_at
FROM connectors.livenessprobe_failed_records
ORDER BY failed_at DESC;
```

Deleted probes:

```sql
SELECT snow_name, health_url, snow_host_url, failure_count, deleted_at
FROM connectors.livenessprobe_deleted_records
ORDER BY deleted_at DESC;
```

## Failure behavior

If PostgreSQL is unreachable at startup, the app throws and exits — the HTTP server and cron will not start.
