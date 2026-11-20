# OAuth setup differences

The dashboard can sign in with GitLab or GitHub. Settings → Authentication has two checkboxes, **Github** and **GitLab**. Checking one clears the other. The choice is stored in this browser (`snow.config.authProvider`) and wins over `config.json` on the next load. `/login` shows one button: **Continue with GitLab** or **Continue with GitHub**.

`config.json` field `authProvider` is the default when the browser has no saved choice. That default is `gitlab`.

Both providers use the authorization-code flow with PKCE (`S256`). The blocks in `config.json` use the same fields. The values, the token exchange, and where the client secret lives are different.

## Config fields

```json
{
  "authProvider": "gitlab",
  "gitlab": {
    "baseUrl": "https://gitlab.com",
    "clientId": "",
    "redirectUri": "http://localhost:4200/login",
    "scopes": "read_user"
  },
  "github": {
    "baseUrl": "https://github.com",
    "clientId": "",
    "redirectUri": "http://localhost:4200/login",
    "scopes": "read:user user:email"
  }
}
```

| Field | GitLab | GitHub |
|---|---|---|
| `baseUrl` | Instance root, such as `https://gitlab.com`. Not `/api/v4`. | `https://github.com`, or the GitHub Enterprise root. Not `https://api.github.com`. |
| `clientId` | GitLab Application ID. | GitHub OAuth app client id. |
| `redirectUri` | Must match the GitLab application exactly. Empty means `{current origin}/login`. | Must match the GitHub OAuth app callback exactly. Empty means `{current origin}/login`. |
| `scopes` | `read_user` reads id, username, name, and email. | `read:user user:email` reads the profile, then the primary verified address from `/user/emails`. |

`config.json` is copied into the dashboard and can be fetched by the browser. Do not put a client secret in that file.

Settings shows the `baseUrl`, `clientId`, and `redirectUri` fields for the checked provider only. GitLab is stored in `snow.config.gitlab`. GitHub is stored in `snow.config.github`. Those values win over `config.json` on the next load. Scopes stay in `config.json`.

## What the browser calls

| Step | GitLab | GitHub |
|---|---|---|
| Authorize | `{gitlab.baseUrl}/oauth/authorize` | `{github.baseUrl}/login/oauth/authorize` |
| Token | The browser `POST`s `{gitlab.baseUrl}/oauth/token` | The browser `POST`s same-origin `/github-oauth/access_token` |
| User | `{gitlab.baseUrl}/api/v4/user` | `https://api.github.com/user` when the host is `github.com`. Otherwise `{github.baseUrl}/api/v3/user` |
| Client secret | Not sent. PKCE (`code_verifier`) is the proof. | Required. The dev server adds it. The browser never sees it. |
| CORS | GitLab must allow this origin on `/oauth/token` and `/api/v4/user`. | `https://github.com/login/oauth/access_token` does not send `Access-Control-Allow-Origin`. A direct `fetch` from `http://localhost:4200` is blocked. `api.github.com` does allow the user request. |

Both authorize requests send `client_id`, `redirect_uri`, `scope`, `state`, `code_challenge`, and `code_challenge_method=S256`. GitLab also sends `response_type=code`.

## GitHub token proxy

`ng serve` loads `proxy.conf.js` (wired in `angular.json` as `proxyConfig`). A `POST` to `/github-oauth/access_token` is handled there and forwarded to `https://github.com/login/oauth/access_token`.

The proxy reads the client secret in this order:

1. Environment variable `GITHUB_CLIENT_SECRET`
2. Repo-root file `github.client-secret`, one line

The file is listed in `.gitignore`. Restart `ng serve` after creating it or after changing the variable. A browser refresh does not reload the proxy.

If neither source has a secret, the proxy returns `missing_client_secret` and does not call GitHub. GitHub’s own message when the secret is missing or does not belong to that client id is: `The client_id and/or client_secret passed are incorrect.`

A static server, including the production dashboard build, does not run `proxy.conf.js`. GitHub sign-in on a deployed host still needs a server-side token exchange that holds the secret.

## Identity and session

| | GitLab | GitHub |
|---|---|---|
| `gitType` | `gitlab` | `github` |
| provider | `gitlab.com` | `github.com` |
| actor | `username` | `login` |
| actor id | numeric `id` | numeric `id` |
| OAuth transaction | `sessionStorage` `snow.gitlab.oauth` | `sessionStorage` `snow.github.oauth` |
| Session | `localStorage` `snow.gitlab.session` | `localStorage` `snow.github.session` |
| Active provider | `localStorage` `snow.auth.provider` | same key, value `github` |

Startup runs `GitlabAuth.restoreSession()` and then `GithubAuth.restoreSession()`. Each one finishes the redirect only when `state` matches its own transaction, so a GitHub callback is not exchanged at GitLab’s token URL.

GitLab access tokens use `expires_in` and are refreshed with `grant_type=refresh_token`. A GitHub OAuth app token often has no expiry. The app keeps it until sign-out. A refresh runs only when GitHub returned both `expires_in` and `refresh_token`.

`DashboardAuth` is what the guard, navbar, settings, and API interceptor read. Connector requests whose URL starts with `snowConfig.api.baseUrl` send `Authorization: Bearer` with the active provider’s access token.

## Files

| File | Role |
|---|---|
| `config.json` | `authProvider`, `gitlab`, and `github` blocks |
| `proxy.conf.js` | GitHub token exchange for `ng serve` |
| `github.client-secret` | Local GitHub client secret, not committed |
| `projects/dashboard/src/app/services/auth/gitlab-auth.ts` | GitLab PKCE and browser token exchange |
| `projects/dashboard/src/app/services/auth/github-auth.ts` | GitHub PKCE and same-origin token exchange |
| `projects/dashboard/src/app/services/auth/dashboard-auth.ts` | The signed-in session, either provider |
| `projects/dashboard/src/app/services/runtime-config.ts` | Loads both blocks before bootstrap |
| `projects/dashboard/src/app/pages/login/` | One continue button |
| `projects/dashboard/src/app/pages/dashboard/settings/` | Provider checkboxes and GitLab field overrides |

GitLab-only setup steps remain in [GITLAB_OAUTH.md](GITLAB_OAUTH.md).
