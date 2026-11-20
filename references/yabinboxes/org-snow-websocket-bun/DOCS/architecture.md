# Architecture

## Overview

`snow-websocket-bun` is a WebSocket server that:

1. **Serves WebSocket connections** on a configurable port (default `3000`).
2. **Polls an external API** on a fixed interval (every 30 seconds).
3. **Broadcasts** the API response (or errors) to all connected WebSocket clients.

It is built with [Bun](https://bun.sh) and uses Bun’s native WebSocket support.

## Components

### WebSocket server (`src/server.ts`)

- Listens for WebSocket upgrades on the given port.
- Assigns each client a UUID on connection and tracks all open sockets in a `Map<id, ServerWebSocket>`.
- Sends a **welcome** message to the new client on connect.
- **Echoes** each incoming message back to the sender and **broadcasts** it to other clients.
- Emits **client_joined** / **client_left** when clients connect or disconnect.
- Serves a `GET /health` HTTP endpoint that returns `{ status, connectedClients, uptimeSeconds, timestamp }` with CORS headers. All other non-WebSocket requests return `400`.
- Exposes two broadcast methods with distinct scopes:
  - Private `broadcast(message, excludeClientId?)` — sends to all open clients **except** the specified one. Used internally when relaying a client message to peers.
  - Public `broadcastToAll(message)` — sends to **every** open client with no exclusions. Used by the API scheduler. Returns the count of clients actually sent to.
- Additional public methods:
  - `getClientCount()` — number of currently tracked clients.
  - `sendToClient(clientId, message)` — send to one specific client by ID. Returns `true` if sent, `false` if not found or not open.

### API scheduler (in `index.ts`)

- Runs every **30 seconds**.
- Performs a **GET** request to `API_URL` (env: `API_URL`, default points to a Snow deployments endpoint).
- On success: broadcasts an **api_response** message to all clients.
- On failure: broadcasts an **api_error** message to all clients.
- Logs server status (connected client count) and request/response summary.

### WebSocket client (`src/client.ts`)

- Reusable client class built on the native `WebSocket` API (no Node dependencies).
- Auto-reconnects on unexpected close using **linear backoff**: delay for attempt `n` = `reconnectInterval * n`. Defaults: `reconnectInterval = 3000 ms`, `maxReconnectAttempts = 10`. Calling `close()` sets an internal flag that suppresses reconnection.
- Callbacks: `onOpen`, `onMessage`, `onClose`, `onError`.
- Methods: `connect()` (returns `Promise<void>`), `send(message)` (returns `boolean`), `close(code?, reason?)`, `isConnected()`, `getState()` (returns the raw `WebSocket.readyState`).

## Data flow

```
External API (every 30s)
        |
        v fetch() in index.ts scheduler
        |
        +---> broadcastToAll()  ─────────────────> ALL connected clients
                                                   (api_response / api_error)

Client A sends a message
        |
        v server message handler
        |
        +---> echo back to Client A         (type: "echo")
        +---> broadcast() to all others     (type: "broadcast", from: clientIdA)

New client connects
        |
        +---> welcome to new client         (type: "welcome")
        +---> broadcast() to all others     (type: "client_joined")

HTTP GET /health  ──> { status, connectedClients, uptimeSeconds, timestamp }
```

- Clients connect via `ws://host:port`.
- All WebSocket messages are JSON over the wire.
- The distinction between `broadcast()` and `broadcastToAll()` is intentional: the scheduler uses `broadcastToAll()` so the message reaches every client, while the per-message relay uses `broadcast(excludeId)` so a client does not receive its own message back as a `broadcast` (it already got the `echo`).
- See [Messages](messages.md) for the exact payload shapes.
