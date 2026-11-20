# snow-websocket-bun

WebSocket server built with [Bun](https://bun.sh) that polls an external API on a schedule and broadcasts responses to all connected clients.

## Features

- **WebSocket server** — Accepts connections on a configurable port (default `3000`), echoes and broadcasts messages between clients.
- **API scheduler** — GET request to a configurable URL every 30 seconds; success/error payloads are broadcast to all clients.
- **Reusable client** — `WebSocketClient` class with reconnection and lifecycle callbacks for building your own clients.

## Quick start

**Install dependencies:**

```bash
bun install
```

**Run the server (and API scheduler):**

```bash
bun run index.ts
```

Connect to `ws://localhost:3000` with any WebSocket client.

**Run with a demo client** (server + one client that sends greetings and pings):

```bash
bun run index.ts --with-client
```

## Configuration

| Variable   | Description | Default |
|-----------|-------------|---------|
| `API_URL` | URL polled every 30s; response/errors are broadcast to all clients. | `http://localhost:8080/connectors/get-snow-deployments?email=...&type=ALL` |

`SERVER_PORT` is hardcoded to `3000` in `index.ts`. Edit that constant directly if you need a different port.

Bun automatically loads `.env` files — no `dotenv` package needed.

Example:

```bash
API_URL=https://api.example.com/status bun run index.ts
```

## HTTP endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Returns `{ status, connectedClients, uptimeSeconds, timestamp }`. Includes CORS headers. |
| `/*` | GET (WebSocket upgrade) | All other paths attempt a WebSocket upgrade; returns `400` if the request is not a WebSocket handshake. |

## Scripts

| Command | Description |
|--------|-------------|
| `bun run index.ts` | Start WebSocket server and API scheduler. |
| `bun run index.ts --with-client` | Same + attach demo client. |
| `bun --hot index.ts` | Start with hot reload (development). |
| `bun run build` | Build to `dist/`. |
| `bun run start` | Run built app: `bun run dist/index.js`. |

## Docker

```bash
docker build -t snow-websocket-bun .
docker run -p 3000:3000 -e API_URL=https://your-api.example.com/status snow-websocket-bun
```

## Documentation

Detailed docs are in the **[DOCS](DOCS/README.md)** folder:

- [Architecture](DOCS/architecture.md) — Server, client, scheduler, and data flow.
- [Messages](DOCS/messages.md) — WebSocket message types (welcome, echo, broadcast, api_response, api_error, etc.).
- [Development](DOCS/development.md) — Environment variables, Docker, CI/CD, and project layout.

---

This project was created with `bun init` (Bun v1.3.5).
