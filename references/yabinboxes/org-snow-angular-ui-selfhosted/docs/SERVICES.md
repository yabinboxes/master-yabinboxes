# Services Documentation

**Project:** Snow Angular UI (`snow-angular-ui`)

This document provides detailed documentation for all services in the Snow Angular UI project.

## Table of Contents

- [FirebaseAuth](#firebaseauth)
- [HandleProfiles](#handleprofiles)
- [HandleProfilesApi](#handleprofilesapi)
- [HandleDeploymentsRequest](#handledeploymentsrequest)
- [NotificationDeployment](#notificationdeployment)

---

## FirebaseAuth

**Location**: `projects/dashboard/src/app/services/auth/firebase-auth.ts`

Authentication service using Firebase with GitHub OAuth support.

### Dependencies

- `@angular/fire/auth`
- Angular Router

### Signals

```typescript
currentUser: Signal<User | null>        // Current authenticated user
isAuthenticated: Signal<boolean>         // Authentication status
isLoading: Signal<boolean>              // Loading state
githubAccessToken: Signal<string | null> // GitHub OAuth access token
```

### Methods

#### `signInWithGitHub(): Observable<User>`

Signs in the user with GitHub OAuth. Requests `repo` and `read:org` so the GitHub token can list private and internal repositories.

**Returns**: Observable that emits the authenticated User

**Example:**
```typescript
authService.signInWithGitHub().subscribe({
  next: (user) => console.log('Signed in:', user),
  error: (error) => console.error('Sign in failed:', error)
});
```

#### `signInWithGoogle(): Observable<User>`

Signs in the user with Google OAuth.

**Returns**: Observable that emits the authenticated User

#### `signOut(): Observable<void>`

Signs out the current user and redirects to login page.

**Returns**: Observable that completes when sign-out is successful

#### `getGithubActorId(user: User): number | null`

Returns the GitHub numeric user id (`actorId`) from Firebase `providerData` where `providerId === 'github.com'`.

#### `getGithubActor(user: User): string | null`

Returns the GitHub username (`actor`) from `reloadUserInfo.screenName` or `displayName`.

#### `getCurrentUserProfile(): UserProfile | null`

Gets the current user's profile information.

**Returns**: UserProfile object or null if not authenticated

**UserProfile Interface:**
```typescript
interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId: string;
  gitType: string;
  actorId?: number | null;
  actor?: string | null;
}
```

#### `getCurrentUser$(): Observable<User | null>`

Gets current user as an Observable.

**Returns**: Observable that emits the current user or null

---

## HandleProfiles

**Location**: `projects/dashboard/src/app/services/handlers/handle-profiles.ts`

Service for managing user profile data, license, and pipeline tokens.

### Properties (Getters/Setters)

```typescript
profile: UserProfile | null              // User profile
license: LicenseType                     // License type ('self' | 'individual' | 'business' | 'empty')
pipelineSnowToken: string                // Pipeline token
org: string                              // Organization
```

### Readonly Signals

```typescript
profileSignal: Signal<UserProfile | null>
licenseSignal: Signal<LicenseType>
pipelineSnowTokenSignal: Signal<string>
orgSignal: Signal<string>
```

### Methods

#### `regenerateToken(identity: { actorId: number; gitType: string }): Observable<PipelineSnowTokenResponse>`

Regenerates the pipeline snow token via API.

**Parameters:**
- `identity.actorId`: GitHub numeric user id
- `identity.gitType`: Git provider type (e.g. `"github"`)

**Returns**: Observable with the regenerated token response

**Example:**
```typescript
profilesService.regenerateToken({ actorId, gitType: 'github' }).subscribe({
  next: (response) => {
    if (response.token) {
      profilesService.pipelineSnowToken = response.token;
    }
  }
});
```

#### `reset(): void`

Resets all profile data. Useful for logout.

---

## HandleProfilesApi

**Location**: `projects/dashboard/src/app/services/actions-api/handle-profiles.api.ts`

API service for profile-related HTTP operations.

### Configuration

Uses environment configuration for API base URL:
- Base URL: `environment.api.baseUrl`
- Endpoints: `environment.api.endpoints`

### Methods

#### `updateLicense(license: LicenseType, email?: string): Observable<UpdateLicenseRequest>`

Updates the user's license type.

**Parameters:**
- `license`: License type to set
- `email` (optional): User's email address

**Returns**: Observable with API response

**Example:**
```typescript
profilesApi.updateLicense('individual', userEmail).subscribe({
  next: (response) => console.log('License updated'),
  error: (error) => console.error('Update failed:', error)
});
```

#### `getPipelineSnowToken(identity: { actorId: number; gitType: string }): Observable<PipelineSnowTokenResponse>`

Retrieves the pipeline snow token.

**Parameters:**
- `identity.actorId`: GitHub numeric user id (query param)
- `identity.gitType`: Git provider type (query param)

**Returns**: Observable with token response

#### `regeneratePipelineSnowToken(identity: { actorId: number; gitType: string }): Observable<PipelineSnowTokenResponse>`

Regenerates the pipeline snow token.

**Parameters:**
- `identity.actorId`: GitHub numeric user id (query param)
- `identity.gitType`: Git provider type (query param)

**Returns**: Observable with regenerated token response

#### `getProfile(email: string, options?: { actorId?: number; actor?: string; gitType?: string }): Observable<APIProfileResponse>`

Gets or creates the user profile. Request body uses camelCase:

```json
{
  "email": "user@example.com",
  "actorId": 583231,
  "actor": "octocat",
  "gitType": "github"
}
```

**Parameters:**
- `email`: User's email address
- `options.actorId` (optional): GitHub numeric user id
- `options.actor` (optional): GitHub username
- `options.gitType` (optional): Git provider type (default `"github"`)

**Returns**: Observable with `{ email, license?, org?, gitType? }`

When `gitType` is present in the response, callers update `HandleProfiles.profile.gitType`.

### Error Handling

All methods include centralized error handling via `handleError()` method that:
- Formats error messages
- Logs errors to console
- Returns proper error observables

---

## HandleDeploymentsRequest

**Location**: `projects/dashboard/src/app/services/handlers/handle-deployments-request.api.ts`

Service for managing deployment data, filtering, and searching.

### Signals

```typescript
sourceDeployments: Signal<SourceDeployment[]>    // Filtered deployments
allSourceDeploymentsSignal: Signal<SourceDeployment[]> // Unfiltered API cache
filters: Signal<TypesForm>                        // Current filter configuration
sourceDeploymentLoading: Signal<boolean>         // Loading state
```

### Methods

#### `loadSourceDeployments(): void`

Loads every row from `snow_deployments_anonymous` once the signed-in user has a GitHub `actorId`.

Calls `GET /connectors/get-snow-deployments` with no query parameters.

**Example:**
```typescript
deploymentsService.loadSourceDeployments();
```

#### `searchSourceDeployments(query: string): void`

Searches deployments by name. Combined with the checkbox filters and the repository filter.

**Parameters:**
- `query`: Search query string (case-insensitive substring of `sourceName`)

#### `currentRepositoryFilter(): string`

Returns the current repository filter, including a value restored from `localStorage`.

#### `filterSourceDeploymentsByRepository(query: string): void`

Filters the card list by repository. A deployment matches when `repository` or `sourceCodeRepository` contains the query (case-insensitive). An empty query shows every deployment that already passed the other filters.

The query is written to `localStorage` under `snow.sources.repositoryFilter` and read back when the service is created.

**Parameters:**
- `query`: Repository text to match

#### `removeSourceDeployment(deployment: SourceDeployment): Promise<void>`

Deletes the profile-table row with `DELETE /connectors/publish-snow-deployment?repository={repository}&actorId={actorId}&gitType={gitType}`, then drops the card from the local list. `repository` comes from the card. `actorId` and `gitType` come from the signed-in profile (`gitType` falls back to `gitlab`). A missing actor id or repository throws, and a failed request leaves the card in place.

#### `setFilters(filters: TypesForm): void`

Updates the filter configuration.

**Parameters:**
- `filters`: New filter configuration

#### `applyFilters(types: TypesForm): void`

Applies filters to the cached deployment list.

**Parameters:**
- `types`: Filter configuration to apply

#### `setSourceDeployments(resource: APISnowDeploymentResponse[]): void`

Sets deployments from WebSocket or other sources.

**Parameters:**
- `resource`: Array of API deployment responses

### Filter Types

The `TypesForm` interface includes:

**Source Types:**
- `applications`: boolean
- `services`: boolean
- `cluster`: boolean

**Providers:**
- `aws`: boolean
- `azure`: boolean
- `digitalocean`: boolean
- `cloudflare`: boolean
- `civo`: boolean

**Colors:**
- `nocolor`: boolean
- `blue`: boolean
- `green`: boolean
- `red`: boolean
- `yellow`: boolean
- `orange`: boolean

---

## NotificationDeployment

**Location**: `projects/dashboard/src/app/services/notification-deployment.websocket.ts`

WebSocket service for real-time deployment notifications.

### Connection States

```typescript
enum WebSocketConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error'
}
```

### Signals

```typescript
connectionState: Signal<WebSocketConnectionState>  // Current connection state
isConnected: Signal<boolean>                       // Connection status
```

### Methods

#### `connect(url: string, autoReconnect = true): void`

Connects to WebSocket server.

**Parameters:**
- `url`: WebSocket server URL
- `autoReconnect`: Enable automatic reconnection (default: true)

**Features:**
- Automatic reconnection with exponential backoff
- Maximum 5 reconnection attempts
- Connection state tracking

#### `sendMessage(message: string): void`

Sends a message through the WebSocket connection.

**Parameters:**
- `message`: Message to send

**Throws**: Error if connection is not open

#### `getMessages(): Observable<string>`

Gets messages as an Observable.

**Returns**: Observable of WebSocket messages

#### `getErrors(): Observable<Error>`

Gets errors as an Observable.

**Returns**: Observable of WebSocket errors

#### `disconnect(): void`

Disconnects from WebSocket server and cleans up.

### Usage Example

```typescript
// Connect
notificationService.connect('ws://snow-monkeys.com:8080/ws');

// Listen to messages
notificationService.getMessages().subscribe(message => {
  const data = JSON.parse(message);
  // Handle message
});

// Listen to errors
notificationService.getErrors().subscribe(error => {
  console.error('WebSocket error:', error);
});

// Disconnect
notificationService.disconnect();
```

---

## Best Practices

### Service Usage

1. **Inject services** using `inject()` function
2. **Use signals** for reactive state
3. **Handle errors** in all API calls
4. **Unsubscribe** from observables (or use async pipe)
5. **Use readonly signals** when exposing state

### Error Handling

All API services include centralized error handling:
- Client-side errors are formatted with user-friendly messages
- Server-side errors include status codes
- Errors are logged to console
- Proper error observables are returned

### State Management

- Use **signals** for local component state
- Use **services** for shared application state
- Use **computed signals** for derived state
- Use **observables** for async operations
