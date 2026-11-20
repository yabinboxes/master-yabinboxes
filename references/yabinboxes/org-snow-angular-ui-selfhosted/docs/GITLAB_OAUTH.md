# GitLab OAuth

The dashboard can sign in with GitLab or GitHub. How those two setups differ, including the GitHub client secret and token proxy, is in [OAUTH_SETUP.md](OAUTH_SETUP.md). This note covers the GitLab flow and the setup that is still required before a real GitLab login can succeed end to end.

## What is implemented

Protected routes still use `authGuard`. The guard reads `GitlabAuth` and sends anonymous visitors to `/login`.

Sign-in is the OAuth 2.0 authorization-code flow with PKCE (`S256`):

1. **Continue with GitLab** on `/login` builds a `code_verifier`, a `code_challenge`, and a `state`.
2. The browser stores that transaction in `sessionStorage` (`snow.gitlab.oauth`) and redirects to `{gitlab.baseUrl}/oauth/authorize`.
3. GitLab redirects back to the redirect URI with `code` and `state`.
4. Before the first route runs, `GitlabAuth.restoreSession()` checks `state`, exchanges the code at `{gitlab.baseUrl}/oauth/token`, and loads the user from `{gitlab.baseUrl}/api/v4/user`.
5. The code is removed from the address bar before the exchange, so a refresh does not reuse a one-time code.
6. The session is stored in `localStorage` (`snow.gitlab.session`) and the user is sent to the URL they were trying to open.

The session stores the access token, refresh token, expiry, and this profile:

| App field | GitLab source |
|---|---|
| `uid` / actor id | numeric `id` |
| `actor` | `username` |
| `displayName` | `name` |
| `email` | `email` |
| `photoURL` | `avatar_url` |
| `gitType` | `gitlab` |
| provider | `gitlab.com` |

API calls whose URL starts with `snowConfig.api.baseUrl` send `Authorization: Bearer <GitLab access token>`. If the access token is inside the last minute of its lifetime, the app refreshes it with `grant_type=refresh_token` before the request. Sign-out clears the local session and returns to `/login`. It does not call GitLab's revoke endpoint.

`config.json` holds the GitLab application settings. `gitlab.clientId` is empty until an application is registered. With an empty client id the login button stays on the page and shows: `GitLab OAuth is not configured. Set gitlab.clientId in config.json.`

```json
{
  "gitlab": {
    "baseUrl": "https://gitlab.com",
    "clientId": "",
    "redirectUri": "",
    "scopes": "read_user"
  }
}
```

| Field | Meaning |
|---|---|
| `baseUrl` | GitLab instance root, with no trailing slash. Use the instance URL for a self-managed GitLab, not `/api/v4`. |
| `clientId` | Application ID from GitLab. The client secret is not stored in the app. |
| `redirectUri` | Must match the GitLab application exactly. An empty value uses `{current origin}/login`. |
| `scopes` | Space-separated scopes. `read_user` is enough for id, username, name, and email. |

Firebase is no longer initialized. `provideFirebaseApp`, `provideAuth`, and the Firebase ID-token interceptor are gone. `environment.ts` no longer contains a Firebase web config.

## Files

| File | Role |
|---|---|
| `projects/dashboard/src/app/services/auth/gitlab-auth.ts` | PKCE, token exchange, user load, session, refresh, sign-out |
| `projects/dashboard/src/app/interceptors/gitlab-auth.interceptor.ts` | Bearer token on connector API calls |
| `projects/dashboard/src/app/app.config.ts` | Restores the session before routing |
| `projects/dashboard/src/app/guards/auth.guard.ts` | Still blocks unauthenticated dashboard routes |
| `projects/dashboard/src/app/pages/login/` | GitLab button and callback landing |
| `projects/dashboard/src/app/services/runtime-config.ts` | Reads the `gitlab` block from `config.json` |
| `config.json` | Instance URL, client id, redirect URI, scopes |

Profile, deployment, settings, and navbar code read `GitlabAuth` for the signed-in user. Deployment loads use the GitLab user id as `actorId` and `gitlab` as `gitType` when the profile does not already have one.

## Pending configuration

These steps are outside the Angular app. Login against a real GitLab account will fail until they are done.

1. **Create a GitLab application.** In the target GitLab (gitlab.com or a self-managed instance): User Settings → Applications, or Admin → Applications. Set the redirect URI to the exact value the dashboard will send. For local `ng serve` that is `http://localhost:4200/login` unless `gitlab.redirectUri` overrides it. Enable the Confidential toggle only if a backend will hold the secret. This app uses PKCE and does not send `client_secret`.
2. **Put the Application ID in** `config.json`**.** Set `gitlab.clientId`. Set `gitlab.baseUrl` when the instance is not gitlab.com. Set `gitlab.redirectUri` when the public origin is not `{origin}/login`.
3. **Confirm the application allows PKCE without a secret.** GitLab must accept `code_challenge` / `code_challenge_method=S256` and a token request that has `code_verifier` and no `client_secret`. If the instance requires a confidential client, add a backend tokeƒn endpoint and stop exchanging the code in the browser. Do not put the client secret in `config.json`.
4. **Confirm browser access to GitLab.** The dashboard calls `/oauth/token` and `/api/v4/user` with `fetch` from the page. If the instance does not allow that origin with CORS, those calls fail in the browser and the exchange has to move to the connectors API.
5. **Teach the connectors API to accept the GitLab access token.** The interceptor still sends `Authorization: Bearer`. The previous token was a Firebase ID token. The backend must validate this GitLab token (or exchange it for its own session) before profile, deployment, tab, and license calls will succeed.
6. **Map GitLab identities in the profile API.** The UI sends `actorId` as the GitLab numeric user id, `actor` as the GitLab username, and `gitType` as `gitlab`. The profile service has to store and return that identity. Existing rows keyed by a GitHub id will not match until they are migrated.
7. **Register every deployed redirect URI** in the GitLab application, including production and any ngrok host. A mismatch is rejected by GitLab before the app sees a code.
8. **Serve** `config.json` **with the real client id** on each environment. The file is copied into the dashboard build and can be replaced on the server without rebuilding.

## Pending product work

- **Token storage.** The access token and refresh token are in `localStorage`. A later step should keep them in memory or in an httpOnly cookie set by the backend.
- **Revoke on sign-out.** Sign-out only deletes the local session. It does not call GitLab `oauth/revoke`.
- **Repository import.** The import screen still calls `api.github.com`. It no longer sends the GitLab token to GitHub. Listing GitLab projects needs a GitLab projects client and the `read_api` scope.
- **Email and password.** The unused login form does not sign anyone in. The button path is GitLab only.
- **Scopes beyond the profile.** `read_user` does not grant repository access. Add scopes only when a feature needs them, and add those scopes on the GitLab application too.
- **Docs that still describe Firebase.** `docs/API_AUTHENTICATION_SECURITY.md` and the Firebase setup notes still describe the old bearer token. Update them when the connectors API accepts GitLab tokens.
- **End-to-end check.** With `gitlab.clientId` empty, the login page shows the configuration error and does not leave the app. A full redirect, token exchange, profile load, and deployment fetch still needs a registered GitLab application and a backend that accepts the token.
