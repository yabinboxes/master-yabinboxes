# API Documentation

**Project:** Snow Angular UI (`snow-angular-ui`)

This document describes the API endpoints used by the Snow Angular UI dashboard application.

## Base URL

```
http://localhost:8080
```

The host is `api.baseUrl` in `projects/dashboard/src/environments/environment.ts`. The container can replace it with `baseUrl` in `infra/docker-compose.yml`. Paths are in `config.ts` and already include `/connectors`, so a profile call is `http://localhost:8080/connectors/profile`. All Snow API JSON bodies and query params use **camelCase**.

## Authentication and security

Connectors API calls from the dashboard send a **Firebase ID token**:

```http
Authorization: Bearer <Firebase_ID_token>
```

The Angular `firebaseAuthInterceptor` attaches this header to every `HttpClient` request whose URL starts with `environment.api.baseUrl`.

> Full details: **[API Authentication and Security](./API_AUTHENTICATION_SECURITY.md)**  
> (token vs pipeline snow token, `authGuard`, backend verification, identity binding, CORS, threat model).

Business fields such as `actorId`, `gitType`, and `email` identify resources; they are **not** a substitute for Bearer authentication.

---

## Profile Endpoints

### Get/Update Profile

**Endpoint**: `POST /connectors/profile`

**Description**: Get or create user profile with license, organization, and git provider type.

**Request Body**:
```json
{
  "email": "user@example.com",
  "actorId": 583231,
  "actor": "octocat",
  "gitType": "github"
}
```

**Response**:
```json
{
  "email": "user@example.com",
  "actor": "octocat",
  "actorId": "583231",
  "gitType": "github",
  "license": "self",
  "org": "organization-name"
}
```

**Usage**:
- Called after successful authentication
- Returns current license type, organization, and git provider type

---

### Update License

**Endpoint**: `PUT /connectors/profile/license`

**Description**: Update user's license type.

**Request Body**:
```json
{
  "email": "user@example.com",
  "license": "individual"
}
```

**Response**: the updated profile (`email`, `actor`, `actorId`, `gitType`, `license`, `org`). `snowToken` is write-only and is omitted.

**License Types**:
- `self`: Self-hosted license
- `individual`: Individual membership
- `business`: Business license

---

### Get Pipeline Snow Token

**Endpoint**: `GET /connectors/profile/snow-token-pipeline?actorId={actorId}&gitType={gitType}`

**Description**: Retrieve the pipeline JWT for a profile. Auth is the Firebase ID token.

**Query Parameters**:
- `actorId` (required): GitHub numeric user id
- `gitType` (optional): Git provider type (default sent by the dashboard: `"github"`)

**Response**:
```json
{
  "token": "abc123..."
}
```

---

### Regenerate Pipeline Snow Token

**Endpoint**: `PUT /connectors/profile/snow-token-pipeline?actorId={actorId}&gitType={gitType}`

**Description**: Regenerate the pipeline snow token.

**Query Parameters**:
- `actorId` (required): GitHub numeric user id
- `gitType` (optional): Git provider type (default sent by the dashboard: `"github"`)

**Request Body**: none

**Response**:
```json
{
  "token": "new-token-abc123..."
}
```

---

## Deployment Endpoints

### Get Snow Deployments

**Endpoint**: `GET /connectors/get-snow-deployments`

**Description**: Returns every row in `snow_deployments_anonymous`. No query parameters. Auth is the Firebase ID token.

**Response**:
```json
[
  {
    "snowDeploymentId": "deployment-123",
    "snowType": "APPLICATION",
    "snowName": "My Application",
    "provider": "digitalocean",
    "repositoryOwner": "username",
    "createdAt": "2024-01-01T00:00:00Z",
    "status": "active",
    "url": "https://example.com",
    "urlPath": "/path",
    "port": "8080",
    "image": "my-image:latest",
    "registry": "docker.io",
    "notes": "Deployment notes",
    "color": "blue"
  }
]
```

---

## WebSocket

### Connection

**URL**: `ws://snow-monkeys.com:8080/ws` (or configured WebSocket URL)

**Description**: Real-time deployment updates via WebSocket.

**Message Format**: JSON string
```json
{
  "data": [
    {
      "snowDeploymentId": "...",
      "snowType": "APPLICATION",
      // ... deployment data
    }
  ]
}
```

**Usage**:
- Connect on application start
- Parse incoming messages as JSON
- Update deployment list in real-time

---

## Error Responses

All endpoints may return error responses:

**Status Codes**:
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

**Error Response Format**:
```json
{
  "message": "Error description",
  "error": "Error details"
}
```

---

## Rate Limiting

Currently, no rate limiting is documented. Check with backend team for rate limiting policies.

---

## CORS

The API should allow CORS requests from:
- `http://localhost:4200` (development)
- Production domain (configured)

---

## Testing

For local development, ensure the backend API is running on `http://localhost:8080`.

To test API endpoints:

```bash
# Get profile
curl -X POST http://localhost:8080/connectors/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <Firebase_ID_token>" \
  -d '{"email":"user@example.com","actorId":"583231","actor":"octocat","gitType":"github"}'

# Get snow deployments
curl -X GET "http://localhost:8080/connectors/get-snow-deployments" \
  -H "Authorization: Bearer <Firebase_ID_token>"

# Update license
curl -X PUT http://localhost:8080/connectors/profile/license \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <Firebase_ID_token>" \
  -d '{"email":"user@example.com","license":"individual"}'
```
