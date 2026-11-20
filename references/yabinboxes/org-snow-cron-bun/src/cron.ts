import cron from "node-cron";
import { inputQueue } from "./queue";
import { MAX_HEALTH_FAILURES, type DashboardPayload, type QueueRecord } from "./types";

/**
 * Fetches the health endpoint for a queued record and forwards the result to the
 * dashboard URL. The two HTTP calls are intentionally sequential: the dashboard
 * POST always fires, even on health-check failure (status 0 + error message).
 * After more than MAX_HEALTH_FAILURES consecutive network failures, the record is
 * moved from livenessprobe_records to livenessprobe_failed_records.
 */
async function processRecord(record: QueueRecord): Promise<void> {

  console.log("[cron] Record queue -> ", record);

  const repoName = record.snowName;

  let healthResponse: string;
  let healthStatus: number;
  let healthFailed = false;
  let healthSucceeded = false;

  try {
    const res = await fetch(record.healthUrl);
    console.log("[cron] res 1 -> ", res);
    healthStatus = res.status;
    healthResponse = await res.text();
    healthSucceeded = res.ok;
  } catch (err) {
    healthFailed = true;
    // Status 0 signals a network-level failure (no HTTP response received).
    healthStatus = 0;
    healthResponse = err instanceof Error ? err.message : String(err);
    console.error(`[cron] Health check failed for "${repoName}":`, healthResponse);
  }

  // Second call: POST to dashboard
  const payload: DashboardPayload = {
    repository: repoName,
    response: healthResponse,
    status: healthStatus.toString()
  };  

  console.log("[cron] payload -> ", payload);

  try {
    const res = await fetch(record.snowHostUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    console.log("[cron] res 2 -> ", res);
    console.log(`[cron] Dashboard POST for "${repoName}" → ${res.status}`);
  } catch (err) {
    console.error(`[cron] Dashboard POST failed for "${repoName}":`, err instanceof Error ? err.message : String(err));
  }

  if (healthFailed) {
    const failureCount = await inputQueue.incrementFailureCount(repoName);
    console.log(`[cron] Failure count for "${repoName}": ${failureCount}`);

    if (failureCount > MAX_HEALTH_FAILURES) {
      await inputQueue.moveToFailed(record, failureCount, healthResponse);
      console.error(
        `[cron] Moved "${repoName}" to livenessprobe_failed_records after ${failureCount} failures`
      );
    }
  } else if (healthSucceeded) {
    await inputQueue.resetFailureCount(repoName);
    console.log(`[cron] Reset failure count for "${repoName}" — health check succeeded`);
  }
}

export function startCron(): void {
  cron.schedule("*/10 * * * *", async () => {
    console.log("[cron] Triggered");
    const records = await inputQueue.getAll();
    console.log(`[cron] Running — ${records.length} record(s) in queue`);
    console.log("record(s) in queue", records);

    if (records.length === 0) return;

    // allSettled so a single record failure doesn't abort the rest.
    await Promise.allSettled(records.map(processRecord));
    console.log("[cron] Done");
  });

  console.log("[cron] Scheduled every 10 minutes");
}
