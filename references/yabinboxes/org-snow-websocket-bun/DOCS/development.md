# Development

## Requirements

- [Bun](https://bun.sh) (v1.x; project was created with v1.3.5)
- Optional: Docker for containerized runs

## Install

```bash
bun install
```

## Scripts

| Command | Description |
|--------|-------------|
| `bun run index.ts` | Start the WebSocket server (and API scheduler). |
| `bun run index.ts --with-client` | Start server and attach a demo client that sends greetings and pings. |
| `bun --hot index.ts` | Start with hot reload for development. |
| `bun run build` | Build to `dist/` (see `package.json`). |
| `bun run start` | Run built output: `bun run dist/index.js`. |

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | URL polled every 30 seconds (GET). Response/errors are broadcast to all WebSocket clients. | `http://localhost:8080/connectors/get-snow-deployments?email=yabin.monroy.1@gmail.com&type=ALL` |

`SERVER_PORT` is hardcoded to `3000` in `index.ts` — it is not read from the environment. Change the `SERVER_PORT` constant directly if a different port is needed.

Bun automatically loads `.env` files at startup — do not add `dotenv` as a dependency.

Example:

```bash
API_URL=https://api.example.com/status bun run index.ts
```

## HTTP endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Returns `{ status: "ok", connectedClients, uptimeSeconds, timestamp }`. Responds with CORS headers (`Access-Control-Allow-Origin: *`). Useful for readiness/liveness probes. |
| `/*` | GET (WebSocket) | All other paths attempt a WebSocket upgrade. Returns `400 Bad Request` if the request is not a WebSocket handshake. |
| `/*` | OPTIONS | Returns `204 No Content` with CORS preflight headers. |

## Manual testing

A Postman collection (`snow-websocket-bun.postman_collection.json` at the repo root) covers the `/health` endpoint and basic WebSocket interactions. Import it directly into Postman or any compatible tool.

No automated test suite is configured yet. Use `bun test` for any tests added.

## Running with Docker

Build:

```bash
docker build -t snow-websocket-bun .
```

Run (port 3000, optional env):

```bash
docker run -p 3000:3000 -e API_URL=https://your-api.example.com/status snow-websocket-bun
```

The Dockerfile uses `oven/bun:alpine`, runs as user `bun`, and executes `bun run index.ts`. No build step is run in the image by default (see Dockerfile comments for optional build).

## CI/CD

The repo includes a GitHub Actions workflow (`.github/workflows/build-and-push-image.yml`) that builds and pushes a Docker image on push to `main`, using the reusable workflow from `snow-monkeys-modules/build-and-push-image`. Image name: `yabinm/snow-websocket-bun` (tag: `latest`).

## Project layout

```
.
├── index.ts           # Entry: server + API scheduler; optional demo client
├── src/
│   ├── server.ts      # WebSocketServer class (Bun.serve + websocket handlers)
│   └── client.ts      # WebSocketClient class (connect, reconnect, send)
├── DOCS/              # Documentation
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Using the client in your own code

```ts
import { WebSocketClient } from "./src/client";

const client = new WebSocketClient({
  url: "ws://localhost:3000",
  reconnectInterval: 2000,
  maxReconnectAttempts: 5,
  onOpen: () => console.log("Connected"),
  onMessage: (msg) => console.log("Message:", msg),
  onClose: (e) => console.log("Closed", e.code, e.reason),
  onError: (err) => console.error("Error", err),
});

await client.connect();
client.send({ type: "ping", timestamp: Date.now() });
// ...
client.close(1000, "Done");
```
