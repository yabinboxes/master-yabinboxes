# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install                        # Install dependencies
bun run index.ts                   # Start server (WebSocket + API scheduler)
bun run index.ts --with-client     # Start server and attach a demo client
bun --hot index.ts                 # Start server with hot reload (dev)
bun build index.ts --outdir dist   # Build to dist/
bun run start                      # Run built app (dist/index.js)
```

No linting or test scripts are configured yet. Use `bun test` for any tests added.

## Architecture

This is a Bun-native WebSocket relay server with zero external npm dependencies. It polls an external API on a 30-second interval and broadcasts results to all connected clients.

**Entry point:** `index.ts` — starts the WebSocket server and launches the API scheduler loop.

**Key modules:**

- `src/server.ts` — `WebSocketServer` wraps `Bun.serve()`. Tracks clients by UUID in a `Map`. Has two broadcast methods: private `broadcast()` (excludes a specific client — used to relay client messages to others) and public `broadcastToAll()` (sends to every client — used for API responses). Exposes `sendToClient()` and `getClientCount()`.
- `src/client.ts` — `WebSocketClient` using the native `WebSocket` API with linear backoff reconnection (`delay = reconnectInterval * attemptCount`) and lifecycle callbacks (`onOpen`, `onMessage`, `onClose`, `onError`).
- `index.ts` — Scheduler uses `setInterval` (30s) to `fetch(API_URL)` and broadcast an `api_response` or `api_error` message to all clients.

**Data flow:**

```
External API (every 30s) → index.ts scheduler → WebSocketServer.broadcastToAll() → all connected clients
```

**WebSocket message types** (documented in `DOCS/messages.md`): `welcome`, `echo`, `broadcast`, `api_response`, `api_error`, `client_joined`, `client_left`.

**HTTP endpoints:**

- `GET /health` — returns `{ status, connectedClients, uptimeSeconds, timestamp }` (CORS headers included).
- Any other path attempts a WebSocket upgrade; returns `400` if not a WebSocket request.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | Snow deployments endpoint | External API polled every 30s |

`SERVER_PORT` is currently hardcoded to `3000` in `index.ts` (not read from env).

Bun automatically loads `.env` files — do not add `dotenv`.

## Testing

A Postman collection is at `snow-websocket-bun.postman_collection.json` for manual API/WebSocket testing.

## Runtime Conventions

Prefer Bun-native APIs over Node/npm equivalents:
- Use `Bun.serve()` not an http/express server
- Use `bun:sqlite` not better-sqlite3
- Use `Bun.redis` not ioredis
- Use `Bun.sql` not pg/postgres.js
- Use `bun test` not jest/vitest
- Use `bun build` not webpack/vite/esbuild
- Use `bunx <pkg>` not npx
- Use `Bun.file()` / `Bun.write()` for file I/O
- Use `Bun.$\`cmd\`` not execa

## Docker

Multi-stage `Dockerfile` uses `oven/bun:alpine`, runs as user `bun`, and executes `bun run index.ts` directly (no build step). CI (`.github/workflows/build-and-push-image.yml`) builds and pushes to `yabinm/snow-websocket-bun` on every push to `main`.
