# snow-websocket-bun — Documentation

Documentation for the WebSocket server and API scheduler built with [Bun](https://bun.sh).

## Contents

| Document | Description |
|----------|-------------|
| [Architecture](architecture.md) | Server, client, and scheduler overview; component diagram. |
| [Messages](messages.md) | WebSocket message types (server → client and client → server). |
| [Development](development.md) | Running locally, Docker, environment variables, and scripts. |

## Quick links

- **Run server only:** `bun run index.ts`
- **Run server + demo client:** `bun run index.ts --with-client`
- **API URL:** Set `API_URL` to change the endpoint polled every 30 seconds; responses are broadcast to all connected clients.
