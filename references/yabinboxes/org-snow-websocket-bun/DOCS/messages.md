# WebSocket messages

All messages are JSON objects. The `type` field identifies the kind of message.

> **Delivery scoping note:** The server has two internal broadcast paths that determine who receives each message type:
> - `broadcast(message, excludeId)` — sends to all clients **except** one. Used for `broadcast`, `client_joined`, and `client_left` so a client does not receive its own relayed messages or join/leave events it initiated.
> - `broadcastToAll(message)` — sends to **every** open client. Used for `api_response` and `api_error` so all subscribers get API updates regardless of sender identity.

## Server → Client

### `welcome`

Sent once when a client connects.

| Field      | Type   | Description                    |
|-----------|--------|--------------------------------|
| `type`    | string | `"welcome"`                    |
| `clientId`| string | Unique ID assigned to the client |
| `message` | string | Human-readable greeting        |
| `timestamp` | number | Unix ms                        |

### `echo`

Sent back to the client that sent a message (echo of that message).

| Field      | Type   | Description           |
|-----------|--------|-----------------------|
| `type`    | string | `"echo"`              |
| `original`| any    | Parsed original message |
| `timestamp` | number | Unix ms             |

### `broadcast`

Sent to **other** clients when one client sends a message.

| Field     | Type   | Description              |
|----------|--------|--------------------------|
| `type`   | string | `"broadcast"`            |
| `from`   | string | `clientId` of sender     |
| `message`| any    | The message content      |
| `timestamp` | number | Unix ms              |

### `client_joined`

Sent to **already-connected clients** when a new client connects. The new client itself does not receive this message (it gets `welcome` instead).

| Field         | Type   | Description              |
|--------------|--------|--------------------------|
| `type`       | string | `"client_joined"`        |
| `clientId`   | string | ID of the new client     |
| `totalClients` | number | Total connected clients including the new one |

### `client_left`

Sent to **remaining clients** when a client disconnects. The disconnecting client does not receive this.

| Field         | Type   | Description              |
|--------------|--------|--------------------------|
| `type`       | string | `"client_left"`          |
| `clientId`   | string | ID of the disconnected client |
| `totalClients` | number | Total connected clients after the disconnect |

### `api_response`

Broadcast to all clients after a successful API poll (every ~30 seconds).

| Field       | Type   | Description        |
|------------|--------|--------------------|
| `type`     | string | `"api_response"`   |
| `timestamp`| string | ISO 8601 timestamp  |
| `url`      | string | API URL called     |
| `status`   | number | HTTP status code   |
| `statusText` | string | HTTP status text |
| `data`     | any    | Parsed response body (or string if not JSON) |

### `api_error`

Broadcast to all clients when the API poll fails.

| Field       | Type   | Description        |
|------------|--------|--------------------|
| `type`     | string | `"api_error"`      |
| `timestamp`| string | ISO 8601 timestamp  |
| `url`      | string | API URL that failed |
| `error`    | string | Error message      |

## Client → Server

Clients can send any JSON object. The server will:

- Echo it back to the sender as `echo`.
- Broadcast it to other clients as `broadcast` with `from` set to the sender’s `clientId`.

Example shapes (optional; server does not require a specific schema):

- `{ "type": "greeting", "message": "Hello" }`
- `{ "type": "ping", "timestamp": 1234567890 }`

Binary frames are accepted; the server will treat them as `{ binary: number[] }` for echo/broadcast.
