---
name: Key non-obvious behaviors
description: Non-obvious business logic details that must be kept accurate in docs; easy to get wrong or omit
type: project
---

## Dual broadcast methods (most common source of doc gaps)

`src/server.ts` has two broadcast methods with different scopes:

- **`broadcast(message, excludeClientId?)`** — private. Sends to all open clients except the specified one. Used for: relaying client messages to peers (`broadcast` type), notifying others of `client_joined`/`client_left`. The new/leaving client is excluded.
- **`broadcastToAll(message)`** — public. Sends to every open client with no exclusions. Returns sent count. Used exclusively by the API scheduler for `api_response` and `api_error`.

This distinction matters for `DOCS/messages.md` delivery scoping and `DOCS/architecture.md`.

## Linear backoff reconnection

`WebSocketClient.attemptReconnect()` computes delay as `reconnectInterval * reconnectAttempts` (linear, not exponential). Default values: `reconnectInterval = 3000 ms`, `maxReconnectAttempts = 10`. Calling `close()` sets `isIntentionallyClosed = true` which suppresses reconnection.

## /health HTTP endpoint

`GET /health` on the same port as WebSocket (default 3000). Returns JSON: `{ status: "ok", connectedClients, uptimeSeconds, timestamp }`. All responses include `Access-Control-Allow-Origin: *`. `OPTIONS` returns 204 with CORS preflight headers. All other non-WebSocket requests return 400.

## SERVER_PORT is hardcoded

`SERVER_PORT` is a constant in `index.ts` (value `3000`), NOT read from environment. It is not an env var. The env vars table should never list it. The CLAUDE.md correctly notes this. `API_URL` is the only actual env var.

## Demo client flag

`--with-client` process argument attaches a `WebSocketClient` instance that sends a greeting 1 second after open, then pings every 5 seconds. SIGINT handler cleans up both the interval and the API scheduler interval.

## Postman collection

`snow-websocket-bun.postman_collection.json` at the repo root is the manual testing artifact. Mention it in `DOCS/development.md`.
