import { deletedTable, ensureProfileRecordsTable, failedTable, pool, profileRecordsTableName, profilesTable, schema, table } from "./db";
import { DEFAULT_SNOW_HOST_URL } from "./types";
import type {
  DeletedLivenessProbeRecord,
  FailedLivenessProbeRecord,
  LivenessProbeProfile,
  LivenessProbeRecord,
  QueueRecord,
  QueueUpsertRequest,
} from "./types";

interface QueueRow {
  snow_name: string;
  health_url: string;
  snow_host_url: string;
}

interface LivenessProbeRow extends QueueRow {
  failure_count: number;
  created_at: Date;
  updated_at: Date;
}

function rowToRecord(row: QueueRow): QueueRecord {
  return {
    snowName: row.snow_name,
    healthUrl: row.health_url,
    snowHostUrl: row.snow_host_url,
  };
}

function rowToLivenessProbeRecord(row: LivenessProbeRow): LivenessProbeRecord {
  return {
    ...rowToRecord(row),
    failureCount: row.failure_count,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

interface FailedLivenessProbeRow extends QueueRow {
  failure_count: number;
  last_error: string;
  failed_at: Date;
  created_at: Date | null;
  updated_at: Date | null;
}

function rowToFailedLivenessProbeRecord(row: FailedLivenessProbeRow): FailedLivenessProbeRecord {
  return {
    ...rowToRecord(row),
    failureCount: row.failure_count,
    lastError: row.last_error,
    failedAt: row.failed_at.toISOString(),
    createdAt: row.created_at?.toISOString() ?? null,
    updatedAt: row.updated_at?.toISOString() ?? null,
  };
}

interface DeletedLivenessProbeRow extends QueueRow {
  failure_count: number;
  deleted_at: Date;
  created_at: Date | null;
  updated_at: Date | null;
}

function rowToDeletedLivenessProbeRecord(row: DeletedLivenessProbeRow): DeletedLivenessProbeRecord {
  return {
    ...rowToRecord(row),
    failureCount: row.failure_count,
    deletedAt: row.deleted_at.toISOString(),
    createdAt: row.created_at?.toISOString() ?? null,
    updatedAt: row.updated_at?.toISOString() ?? null,
  };
}

export function parseQueueUpsertRequest(
  body: unknown
): { ok: true; request: QueueUpsertRequest } | { ok: false; status: number; error: string } {
  const record = body as Partial<QueueUpsertRequest>;

  if (!record.snowName || !record.healthUrl || !record.actorId || !record.gitType) {
    return {
      ok: false,
      status: 422,
      error: "Missing required fields: snowName, healthUrl, actorId, gitType",
    };
  }

  return {
    ok: true,
    request: {
      snowName: record.snowName,
      healthUrl: record.healthUrl,
      snowHostUrl: record.snowHostUrl,
      actorId: record.actorId,
      gitType: record.gitType,
    },
  };
}

export function parseQueueListParams(
  url: URL
): { ok: true; actorId: string; gitType: string } | { ok: false; status: number; error: string } {
  const actorId = url.searchParams.get("actorId");
  const gitType = url.searchParams.get("gitType");

  if (!actorId || !gitType) {
    return {
      ok: false,
      status: 422,
      error: "Missing required query parameters: actorId, gitType",
    };
  }

  return { ok: true, actorId, gitType };
}

function toQueueRecord(request: QueueUpsertRequest): QueueRecord {
  return {
    snowName: request.snowName,
    healthUrl: request.healthUrl,
    snowHostUrl: request.snowHostUrl ?? DEFAULT_SNOW_HOST_URL,
  };
}

async function getOrCreateProfile(snowName: string, actorId: string, gitType: string): Promise<number> {
  const existing = await pool.query<{ id: string }>(
    `SELECT id FROM ${schema}.${profilesTable} WHERE actor_id = $1 AND git_type = $2`,
    [actorId, gitType]
  );

  if (existing.rows[0]) return Number(existing.rows[0].id);

  const inserted = await pool.query<{ id: string }>(
    `INSERT INTO ${schema}.${profilesTable} (snow_name, actor_id, git_type)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [snowName, actorId, gitType]
  );

  const profileId = inserted.rows[0]?.id;
  if (!profileId) throw new Error("Failed to create liveness probe profile");

  return Number(profileId);
}

async function getProfileId(actorId: string, gitType: string): Promise<number | null> {
  const result = await pool.query<{ id: string }>(
    `SELECT id FROM ${schema}.${profilesTable} WHERE actor_id = $1 AND git_type = $2`,
    [actorId, gitType]
  );

  return result.rows[0] ? Number(result.rows[0].id) : null;
}

async function upsertProbeRecord(
  tableName: string,
  record: QueueRecord
): Promise<"inserted" | "updated"> {
  const existing = await pool.query(
    `SELECT 1 FROM ${schema}.${tableName} WHERE snow_name = $1`,
    [record.snowName]
  );

  await pool.query(
    `INSERT INTO ${schema}.${tableName} (snow_name, health_url, snow_host_url, failure_count, updated_at)
     VALUES ($1, $2, $3, 0, NOW())
     ON CONFLICT (snow_name) DO UPDATE SET
       health_url = EXCLUDED.health_url,
       snow_host_url = EXCLUDED.snow_host_url,
       failure_count = 0,
       updated_at = NOW()`,
    [record.snowName, record.healthUrl, record.snowHostUrl]
  );

  return existing.rowCount ? "updated" : "inserted";
}

interface ProfileRow {
  id: string;
  snow_name: string | null;
  actor_id: string;
  git_type: string;
}

function rowToProfile(row: ProfileRow, records: LivenessProbeRecord[]): LivenessProbeProfile {
  return {
    id: Number(row.id),
    snowName: row.snow_name,
    actorId: row.actor_id,
    gitType: row.git_type,
    records,
    total: records.length,
  };
}

async function profileTableExists(profileId: number): Promise<boolean> {
  const tableName = profileRecordsTableName(profileId);
  const result = await pool.query<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM information_schema.tables
       WHERE table_schema = $1 AND table_name = $2
     ) AS exists`,
    [schema, tableName]
  );
  return result.rows[0]?.exists ?? false;
}

async function getRecordsForProfileTable(profileId: number): Promise<LivenessProbeRecord[]> {
  if (!(await profileTableExists(profileId))) return [];

  const profileTable = profileRecordsTableName(profileId);
  const result = await pool.query<LivenessProbeRow>(
    `SELECT snow_name, health_url, snow_host_url, failure_count, created_at, updated_at
     FROM ${schema}.${profileTable}
     ORDER BY snow_name`
  );
  return result.rows.map(rowToLivenessProbeRecord);
}

class InputQueue {
  /** Inserts or replaces a record keyed by `snowName`. Callers can update URLs by re-posting the same name. */
  async upsert(request: QueueUpsertRequest): Promise<{ action: "inserted" | "updated" }> {
    const record = toQueueRecord(request);
    const profileId = await getOrCreateProfile(
      record.snowName,
      request.actorId,
      request.gitType
    );
    const profileTable = await ensureProfileRecordsTable(profileId);
    const action = await upsertProbeRecord(profileTable, record);
    return { action };
  }

  async getAllForProfile(actorId: string, gitType: string): Promise<LivenessProbeRecord[] | null> {
    const profileId = await getProfileId(actorId, gitType);
    if (profileId === null) return null;

    await ensureProfileRecordsTable(profileId);
    const profileTable = profileRecordsTableName(profileId);

    const result = await pool.query<LivenessProbeRow>(
      `SELECT snow_name, health_url, snow_host_url, failure_count, created_at, updated_at
       FROM ${schema}.${profileTable}
       ORDER BY snow_name`
    );
    return result.rows.map(rowToLivenessProbeRecord);
  }

  async getAllProfilesWithRecords(): Promise<LivenessProbeProfile[]> {
    const profiles = await pool.query<ProfileRow>(
      `SELECT id, snow_name, actor_id, git_type
       FROM ${schema}.${profilesTable}
       ORDER BY id`
    );

    return Promise.all(
      profiles.rows.map(async (row) => {
        const records = await getRecordsForProfileTable(Number(row.id));
        return rowToProfile(row, records);
      })
    );
  }

  async getAll(): Promise<LivenessProbeRecord[]> {
    const result = await pool.query<LivenessProbeRow>(
      `SELECT snow_name, health_url, snow_host_url, failure_count, created_at, updated_at
       FROM ${schema}.${table}
       ORDER BY snow_name`
    );
    return result.rows.map(rowToLivenessProbeRecord);
  }

  async getAllFailed(): Promise<FailedLivenessProbeRecord[]> {
    const result = await pool.query<FailedLivenessProbeRow>(
      `SELECT snow_name, health_url, snow_host_url, failure_count, last_error, failed_at, created_at, updated_at
       FROM ${schema}.${failedTable}
       ORDER BY failed_at DESC`
    );
    return result.rows.map(rowToFailedLivenessProbeRecord);
  }

  async getAllDeleted(): Promise<DeletedLivenessProbeRecord[]> {
    const result = await pool.query<DeletedLivenessProbeRow>(
      `SELECT snow_name, health_url, snow_host_url, failure_count, deleted_at, created_at, updated_at
       FROM ${schema}.${deletedTable}
       ORDER BY deleted_at DESC`
    );
    return result.rows.map(rowToDeletedLivenessProbeRecord);
  }

  async size(): Promise<number> {
    const result = await pool.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM ${schema}.${table}`
    );
    return Number(result.rows[0]?.count ?? 0);
  }

  async resetFailureCount(snowName: string): Promise<void> {
    await pool.query(
      `UPDATE ${schema}.${table}
       SET failure_count = 0, updated_at = NOW()
       WHERE snow_name = $1`,
      [snowName]
    );
  }

  async incrementFailureCount(snowName: string): Promise<number> {
    const result = await pool.query<{ failure_count: number }>(
      `UPDATE ${schema}.${table}
       SET failure_count = failure_count + 1, updated_at = NOW()
       WHERE snow_name = $1
       RETURNING failure_count`,
      [snowName]
    );
    return result.rows[0]?.failure_count ?? 0;
  }

  async moveToFailed(record: QueueRecord, failureCount: number, lastError: string): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const existing = await client.query<{ created_at: Date; updated_at: Date }>(
        `SELECT created_at, updated_at FROM ${schema}.${table} WHERE snow_name = $1`,
        [record.snowName]
      );

      await client.query(
        `INSERT INTO ${schema}.${failedTable}
           (snow_name, health_url, snow_host_url, failure_count, last_error, failed_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7)
         ON CONFLICT (snow_name) DO UPDATE SET
           health_url = EXCLUDED.health_url,
           snow_host_url = EXCLUDED.snow_host_url,
           failure_count = EXCLUDED.failure_count,
           last_error = EXCLUDED.last_error,
           failed_at = NOW(),
           updated_at = EXCLUDED.updated_at`,
        [
          record.snowName,
          record.healthUrl,
          record.snowHostUrl,
          failureCount,
          lastError,
          existing.rows[0]?.created_at ?? null,
          existing.rows[0]?.updated_at ?? null,
        ]
      );

      await client.query(
        `DELETE FROM ${schema}.${table} WHERE snow_name = $1`,
        [record.snowName]
      );

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteFromQueue(snowName: string): Promise<QueueRecord | null> {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const existing = await client.query<QueueRow & { failure_count: number; created_at: Date; updated_at: Date }>(
        `SELECT snow_name, health_url, snow_host_url, failure_count, created_at, updated_at
         FROM ${schema}.${table}
         WHERE snow_name = $1`,
        [snowName]
      );

      if (!existing.rows[0]) {
        await client.query("ROLLBACK");
        return null;
      }

      const row = existing.rows[0];

      await client.query(
        `INSERT INTO ${schema}.${deletedTable}
           (snow_name, health_url, snow_host_url, failure_count, deleted_at, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), $5, $6)
         ON CONFLICT (snow_name) DO UPDATE SET
           health_url = EXCLUDED.health_url,
           snow_host_url = EXCLUDED.snow_host_url,
           failure_count = EXCLUDED.failure_count,
           deleted_at = NOW(),
           updated_at = EXCLUDED.updated_at`,
        [
          row.snow_name,
          row.health_url,
          row.snow_host_url,
          row.failure_count,
          row.created_at,
          row.updated_at,
        ]
      );

      await client.query(
        `DELETE FROM ${schema}.${table} WHERE snow_name = $1`,
        [snowName]
      );

      await client.query("COMMIT");
      return rowToRecord(row);
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

export const inputQueue = new InputQueue();
