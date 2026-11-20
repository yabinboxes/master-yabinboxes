import { initDb } from "./db";
import { inputQueue, parseQueueListParams, parseQueueUpsertRequest } from "./queue";
import { startCron } from "./cron";
import type { QueueRecord } from "./types";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST",
  "Access-Control-Allow-Headers": "Content-Type",
};

function withCors(res: Response): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

async function readJsonBody(req: Request): Promise<{ ok: true; body: unknown } | { ok: false; response: Response }> {
  try {
    return { ok: true, body: await req.json() };
  } catch {
    return { ok: false, response: Response.json({ error: "Invalid JSON body" }, { status: 400 }) };
  }
}

await initDb();
startCron();

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname === "/queue") {
      const json = await readJsonBody(req);
      if (!json.ok) return withCors(json.response);

      const parsed = parseQueueUpsertRequest(json.body);
      if (!parsed.ok) {
        return withCors(Response.json({ error: parsed.error }, { status: parsed.status }));
      }

      const { action } = await inputQueue.upsert(parsed.request);
      return withCors(Response.json(
        { message: `Record ${action}`, snowName: parsed.request.snowName },
        { status: action === "inserted" ? 201 : 200 }
      ));
    }

    if (req.method === "POST" && url.pathname === "/delete-record-from-queue") {
      const json = await readJsonBody(req);
      if (!json.ok) return withCors(json.response);

      const { snowName } = json.body as Partial<QueueRecord>;

      if (!snowName) {
        return withCors(Response.json(
          { error: "Missing required field: snowName" },
          { status: 422 }
        ));
      }

      const deleted = await inputQueue.deleteFromQueue(snowName);

      if (!deleted) {
        return withCors(Response.json(
          { error: `Record not found: ${snowName}` },
          { status: 404 }
        ));
      }

      return withCors(Response.json(
        { message: "Record deleted", snowName, record: deleted },
        { status: 200 }
      ));
    }

    if (req.method === "GET" && url.pathname === "/queue") {
      const parsed = parseQueueListParams(url);
      if (!parsed.ok) {
        return withCors(Response.json({ error: parsed.error }, { status: parsed.status }));
      }

      const records = await inputQueue.getAllForProfile(parsed.actorId, parsed.gitType);
      if (records === null) {
        return withCors(Response.json({ error: "Profile not found" }, { status: 404 }));
      }

      return withCors(Response.json({ records, total: records.length }));
    }

    if (req.method === "GET" && url.pathname === "/profiles") {
      const profiles = await inputQueue.getAllProfilesWithRecords();
      return withCors(Response.json({ profiles, total: profiles.length }));
    }

    if (req.method === "GET" && url.pathname === "/failed-records") {
      const records = await inputQueue.getAllFailed();
      return withCors(Response.json({ records, total: records.length }));
    }

    if (req.method === "GET" && url.pathname === "/deleted-records") {
      const records = await inputQueue.getAllDeleted();
      return withCors(Response.json({ records, total: records.length }));
    }

    if (req.method === "GET" && url.pathname === "/health") {
      return withCors(Response.json({ status: "ok", uptime: process.uptime() }));
    }

    return withCors(Response.json({ error: "Not found" }, { status: 404 }));
  },
});

console.log(`[server] Listening on http://localhost:${server.port}`);
