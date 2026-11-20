# Differences: `org-snow-angular-ui` and `org-snow-angular-ui-selfhosted`

Two checkouts of the Snow dashboard. The layout is the same; the differences below are where each copy runs and how it talks to the API.

| Project | Where the dashboard runs |
|---|---|
| `org-snow-angular-ui-selfhosted` | `http://localhost:4200` when started from `infra/docker-compose.yml`. GitHub or GitLab sign-in. API host read at startup. |
| `org-snow-angular-ui` | The same dashboard on a private server at `https://snow-monkeys.com/`. GitHub sign-in only. Deployments scoped by `actorId` and `gitType`. |

Compared on **2026-11-14**. `org-snow-angular-ui` is clean on `main`. `org-snow-angular-ui-selfhosted` is `main` with uncommitted edits in this file. `node_modules`, `dist`, `.git`, `.angular`, and `coverage` were excluded.

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| Path | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
| Remote | `https://github.com/yabinboxes/org-snow-angular-ui.git` | `https://github.com/yabinboxes/org-snow-angular-ui-selfhosted.git` |
| Branch | `main` @ `89656b6` (2026-10-20, “updates”) | `main` @ `83504e2` (2026-11-14, “updates”) |
| Dashboard address | `https://snow-monkeys.com/` | `http://localhost:4200` in `infra/docker-compose.yml` |

`org-snow-angular-ui` also contains a docs app. `org-snow-angular-ui-selfhosted` is the dashboard only. `projects/docs` and `Dockerfile.docs` are not in this repository. Stack and most dashboard child routes match. The dashboard at `https://snow-monkeys.com/` signs in with GitHub only and loads deployments with `actorId`, `gitType`, and `type=ALL`. `org-snow-angular-ui-selfhosted` signs in with GitHub or GitLab, reads the API host at startup, and loads deployments with no query parameters.

Dependency versions in `package.json` match, including `@angular/fire`. This copy does not initialize Firebase. `org-snow-angular-ui` still has `start:docs`, `build:docs`, `serve:ssr:docs`, and `test:docs`. Those scripts are gone here.

## What is the same

- Angular 21 standalone apps, Tailwind CSS 4, DaisyUI, signals, and `inject()`.
- Shared connector paths: profile, profile license, pipeline token, snow deployments, and tabs. The host and the `/connectors` prefix are composed differently (below).
- Dashboard children under `dashboard`: `''` (sources), `history`, `easy-deployment`, `settings`, `reports`, `self-license`, `individual-license`. The `import` child is deprecated and not routed in both `app.routes.ts`. `dashboard-test` exists in both and is not guarded.
- Profile POST body shape: `{ email, actorId?, actor?, gitType? }`.

## Auth

`org-snow-angular-ui-selfhosted` can sign in with GitHub or GitLab. `org-snow-angular-ui` can sign in with GitHub only.

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| Providers | GitHub only | GitHub or GitLab |
| Sign-in | Firebase GitHub OAuth. Login shows **Continue with GitHub** | Authorization-code + PKCE. Login shows one button: **Continue with GitHub** or **Continue with GitLab** |
| Session service | `FirebaseAuth` | `GitlabAuth`, `GithubAuth`, and `DashboardAuth` |
| HTTP interceptor | `firebase-auth.interceptor.ts` | `gitlab-auth.interceptor.ts` (uses `DashboardAuth` for either provider) |
| App providers | `provideFirebaseApp` / `provideAuth` | Browser initializer restores the GitLab session, then the GitHub session. SSR skips that restore |
| Default `gitType` | `github` | `gitlab` |

`org-snow-angular-ui-selfhosted` only:

- `config.ts` exports `dashboardConfig`: `authProvider` (`gitlab` by default), plus `gitlab` and `github` blocks (`baseUrl`, `clientId`, `redirectUri`, `scopes`). GitHub scopes are `read:user user:email`. Do not copy client ids out of that file. There is no client secret in it.
- `RuntimeConfig` mounts that object on `globalThis.snowConfig`. Browser overrides live in `snow.config.gitlab`, `snow.config.github`, and `snow.config.authProvider`.
- GitHub’s token endpoint does not allow a browser CORS call. `proxy.conf.js` (dashboard `serve.options.proxyConfig`) accepts `POST /github-oauth/access_token` and adds the secret from `GITHUB_CLIENT_SECRET` or the gitignored file `github.client-secret`. A static or SSR host does not run that proxy.
- After the access token, GitHub sign-in reads the primary verified address from `/user/emails`.
- Settings shows **Github** and **GitLab** checkboxes. The matching `baseUrl` / `clientId` / `redirectUri` section is the only one rendered. Save calls `PUT /connectors/self-hosted`.
- `docs/OAUTH_SETUP.md` and `docs/GITLAB_OAUTH.md` exist only in `org-snow-angular-ui-selfhosted`.

`org-snow-angular-ui` only:

- `projects/dashboard/src/app/services/auth/firebase-auth.ts`
- `projects/dashboard/src/app/interceptors/firebase-auth.interceptor.ts`
- Firebase web config in `environment.ts` and `environment.prod.ts`

## CORS

`org-snow-angular-ui` signs in with `signInWithPopup`. The page does not call `https://github.com/login/oauth/access_token`. Connector calls go from `https://snow-monkeys.com` to `https://api.snow-monkeys.com`, so that API must allow the dashboard origin. There is no `proxy.conf.js`.

`org-snow-angular-ui-selfhosted` calls the provider from the page:

- GitHub `POST https://github.com/login/oauth/access_token` sends no `Access-Control-Allow-Origin`, so the browser cannot exchange the code. `ng serve` accepts same-origin `POST /github-oauth/access_token` in `proxy.conf.js` and forwards it. That proxy answers with `Access-Control-Allow-Origin: *`. `GET https://api.github.com/user` and `GET https://api.github.com/user/emails` are allowed by `api.github.com`. The production Node server does not run `proxy.conf.js`.
- The dashboard server (`projects/dashboard/src/server.ts`) answers every request, including preflight, with `Access-Control-Allow-Origin: *`.
- GitLab `POST {gitlab}/oauth/token` and `GET {gitlab}/api/v4/user` succeed only when that GitLab instance allows the dashboard origin.
- Connector calls go from the dashboard origin (`http://localhost:4200` in compose) to `{baseUrl}` (`http://localhost:8080` by default). Those are different origins, so the connectors API must allow the dashboard origin.

## API host

`org-snow-angular-ui` is served at `https://snow-monkeys.com/`. `environment.ts` and `environment.prod.ts` set `api.baseUrl` to `https://api.snow-monkeys.com/connectors`. Endpoint strings in those files start at the resource (`/profile`, `/get-snow-deployments`). The request URL is `https://api.snow-monkeys.com/connectors` plus that resource, for example `POST https://api.snow-monkeys.com/connectors/profile`.

`org-snow-angular-ui-selfhosted` has one environment file, `projects/dashboard/src/environments/environment.ts`. Its fallback host is `http://localhost:8080`. Endpoint paths in `config.ts` already include `/connectors`, and `config.ts` leaves `api.baseUrl` empty.

Startup in `projects/dashboard/src/main.ts`:

1. `GET /bootstrap-config.json`. The dashboard SSR server (`projects/dashboard/src/server.ts`) answers with `{ baseUrl }` from the process environment `baseUrl`.
2. `loadRuntimeConfig` uses that URL when it is a valid http(s) URL.
3. Otherwise it uses `environment.api.baseUrl` (`http://localhost:8080`).

`RuntimeConfig.url(endpoint)` joins that host with the `/connectors/...` path from `config.ts`. `TabsActionsApi` uses the same helper.

## First-time setup

`org-snow-angular-ui-selfhosted` only. The dashboard asks for GitLab or GitHub settings before sign-in when the saved record says so.

`firstTimeEntryGuard` is on `login` and on `''` (the root renders the login component; it does not redirect to `dashboard`). An authenticated user on `/login` stays there. Any other authenticated hit goes to `/dashboard`. An unauthenticated hit calls `GET {baseUrl}/connectors/self-hosted`:

- `firstTimeFlag === 1` goes to `/settings-first-time-configs`.
- Any other successful record stays on `/login`, or sends a non-login URL to `/login`.
- A failed request goes to `/backend-unavailable`.

`/settings-first-time-configs` edits the same GitLab or GitHub fields and finishes with `PUT /connectors/self-hosted/first-time-flag`, including `hostBaseUrl`. Later Settings saves use `PUT /connectors/self-hosted`. `RuntimeConfig.applyPersistedSetup` copies the saved provider into the live config and `localStorage`.

Files:

- `projects/dashboard/src/app/guards/first-time-entry.guard.ts`
- `projects/dashboard/src/app/services/actions-api/self-hosted.api.ts`
- `projects/dashboard/src/app/pages/settings-first-time-configs/`
- `projects/dashboard/src/app/pages/backend-unavailable/`

## Dashboard behavior

### Listing deployments

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| Method | `fetchSnowDeployments(actorId, type, gitType)` | `fetchSnowDeployments()` |
| Request | `GET https://api.snow-monkeys.com/connectors/get-snow-deployments?actorId={id}&gitType={gitType}&type=ALL` | `GET {baseUrl}/connectors/get-snow-deployments` with no query parameters |
| Query key | `['snow-deployments', actorId, gitType, 'ALL']` | `['snow-deployments']` |
| Enabled when | `actorId` is set | `actorId` is set |
| Actor helper | `getGithubActorId`; missing id logs a GitHub message. Fallback `gitType` is `github` | `getActorId`; missing id logs “Sign in before loading deployments.” Fallback `gitType` is `gitlab` |
| Second request | `GET https://api.snow-monkeys.com/connectors/get-snow-deployments-persistent` | None. The endpoint is not in `config.ts` or `environment.ts` |

In `org-snow-angular-ui`, `HandleDeploymentsRequest` loads both lists and overlays persistent terraform/docker JSON onto the profile rows. Match key is `repository` + `snowName` (case-insensitive). When several persistent rows match, the highest `snowDeploymentId` wins. A failed persistent call is treated as an empty list so the profile list still renders.

Files:

- `projects/dashboard/src/app/services/actions-api/deployments-actions.api.ts`
- `projects/dashboard/src/app/services/handlers/handle-deployments-request.api.ts`
- `projects/dashboard/src/environments/environment.ts`
- `config.ts` (`org-snow-angular-ui-selfhosted`)

### History page

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| Loader | `loadPersistentDeployments()` | `loadSourceDeployments()` (the same list as Sources) |
| Color and liveness | `PUT` through `updateDeploymentColor` and `updateDeploymentLivenessType` | The same two `PUT`s on the history page |

`projects/dashboard/src/app/pages/dashboard/sources-history/sources-history.ts`

### Publish and delete

The import screen is deprecated in both checkouts. `app.routes.ts` leaves `import` commented out with `Deprecated: import screen is not routed.` The navbar Import link is replaced by that same comment. `Import` and `ImportGitReporitoies` are marked `@deprecated`. Sources and History no longer import that component. The empty-list redirect to `/dashboard/import` stays commented out.

Publishing repositories from that screen is deprecated in both checkouts and is not implemented in `org-snow-angular-ui-selfhosted`. `Import` and `ImportGitReporitoies` are `@deprecated`. There is no `publishSnowDeployment` method and no `PublishSnowDeploymentPayload`.

`org-snow-angular-ui` still has deprecated publish code on that unrouted screen:

- `publishSnowDeployment` on `DeploymentsActionsApi` and `HandleDeploymentsRequest` is `@deprecated`. It sends `POST https://api.snow-monkeys.com/connectors/publish-snow-deployment`.
- `PublishSnowDeploymentPayload` is `@deprecated`.
- `publishSelectedRepos()` builds one payload per selected GitHub repo and is the only caller.

`org-snow-angular-ui-selfhosted` card delete is implemented:

- `deleteSnowDeployment` calls `DELETE {baseUrl}/connectors/publish-snow-deployment?repository={repository}&actorId={actorId}&gitType={gitType}`. `removeSourceDeployment` uses the signed-in actor id and profile `gitType` (fallback `gitlab`), then drops the card.

Color and liveness URLs differ by prefix:

- `org-snow-angular-ui`: `https://api.snow-monkeys.com/connectors/publish-snow-deployment/color/{id}` and `.../liveness-type/{id}`.
- `org-snow-angular-ui-selfhosted`: `{baseUrl}/connectors/publish-snow-deployment/color/{id}` and `.../liveness-type/{id}`.

Files:

- `projects/dashboard/src/app/components/import-git-reporitories/import-git-reporitories.ts`
- `projects/dashboard/src/app/components/import-git-reporitories/import-git-reporitories.html`
- `projects/dashboard/src/app/interfaces/api/api-deployment.interface.ts`

### Color and liveness on Sources

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| Sources page | Optimistic update, then `PUT` | Optimistic update, then the same `PUT`s |
| History page | `PUT` | `PUT` |

`projects/dashboard/src/app/pages/dashboard/sources/sources.ts`

### Source types and filters

Both apps use `SourceType` `'application' | 'service' | 'cluster' | 'resource'`.

Both have:

- `resources` on `TypesForm`, the filters form, and the filters checkbox.
- Card icons for `sourceType === 'resource'` in `card.html`.
- A mapper branch that turns `resource` / `resources` into `'resource'`. Anything else still falls through to `'application'`.

`projects/dashboard/src/app/interfaces/model/filters.interface.ts`
`projects/dashboard/src/app/interfaces/model/source-deployment.interface.ts`
`projects/dashboard/src/app/mapper/source-deployment.mapper.ts`
`projects/dashboard/src/app/components/filters/filters.ts`
`projects/dashboard/src/app/components/filters/filters.html`
`projects/dashboard/src/app/components/card/card.html`

### Deployment model

`org-snow-angular-ui` `APISnowDeploymentResponse` uses a string `snowDeploymentId`, union types for liveness, and optional `terraformOutput`, `terraformVars`, `dockerOutput`, `dockerVars`. It also defines `APIPersistentSnowDeployment`.

`org-snow-angular-ui-selfhosted`:

- `snowDeploymentId` is `string | number` (the mapper always stores `String(...)`).
- Extra response fields: `gitType`, `actor`, `actorId`, `livenessResponse`, `updatedAt`, `environment`, `description`, `email`.
- Liveness fields are plain `string`.
- `terraformOutput`, `terraformVars`, `dockerOutput`, and `dockerVars` are on the API type and on `SourceDeployment`. The self-hosted publish API stores `terraformOutput` only. The other three panels stay hidden when the response omits them.
- Description prefers `item.description`, then `item.notes`. `org-snow-angular-ui` uses `item.notes` only.

Sources and History in both apps render terraform output, terraform vars, docker output, and docker vars when those fields are present.

`projects/dashboard/src/app/pages/dashboard/sources/sources.html`
`projects/dashboard/src/app/pages/dashboard/sources-history/sources-history.html`

### Search and repository filter

`org-snow-angular-ui-selfhosted` only:

- A second input, **Filter by repository**, under **Search deployments**.
- `filterSourceDeploymentsByRepository` matches a case-insensitive substring of `repository` or `sourceCodeRepository`.
- The value is stored in `localStorage` under `snow.sources.repositoryFilter` and restored when `HandleDeploymentsRequest` is created.
- Name search, repository text, and the checkbox filters are applied together.

`org-snow-angular-ui` search is by `sourceName` only.

`projects/dashboard/src/app/pages/dashboard/sources/sources.ts`
`projects/dashboard/src/app/pages/dashboard/sources/sources.html`

### Profile

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| `GetProfileRequest.actorId` | `number` | `string` |
| Request body | `actorId` copied when it is not `null` | `actorId` copied when it is not `null` and not `''`, then sent as `String(actorId)` |
| Fallback `gitType` on the profile query | `github` | `gitlab` |
| After `getProfile` | Writes `gitType` onto the profile when the response value changes | Writes `actor`, numeric `actorId`, and `gitType` when any of them differ. A non-numeric `actorId` leaves the current id in place |

Both shells hide `<router-outlet>` until `profileAndTabsReady()` (`!profileQuery.isPending()`). A missing email leaves that query disabled, so the outlet stays on “Loading profile…”.

`projects/dashboard/src/app/services/actions-api/handle-profiles.api.ts`
`projects/dashboard/src/app/interfaces/api/api-profile.interface.ts`
`projects/dashboard/src/app/pages/dashboard/dashboard.ts`

`APIProfileResponse` in the deployment interface file also differs: `org-snow-angular-ui-selfhosted` adds optional `actor` and `actorId` (`string`) next to `email`, `license`, `org`, and `gitType`.

## Workspace, serve, and containers

`angular.json`:

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| Dashboard build | Browser bundle | SSR: `main.server.ts`, `outputMode: server`, `server.ts` |
| Dashboard dev server | `allowedHosts`: `snow-monkeys.com` | `proxyConfig`: `proxy.conf.js`. `allowedHosts`: `5dccaf28af0e.ngrok-free.app`, `snow-monkeys.com` |
| Docs app | `projects/docs`, dev `allowedHosts` `localhost` and `docs.snow-monkeys.com` | Not in `org-snow-angular-ui-selfhosted` |

`Dockerfile.dashboard`: `org-snow-angular-ui` copies the browser build into nginx and listens on port 80. `org-snow-angular-ui-selfhosted` runs `node dist/dashboard/server/server.mjs` on port 4000.

`infra/docker-compose.yml`: `org-snow-angular-ui` runs `yabinm/snow-ui-dashboard:latest` as `snow-ui-dashboard` on `4200:80`, plus a docs container on `4201:4000`. `org-snow-angular-ui-selfhosted` runs `yabinm/snow-ui-dashboard-selfhosted:latest` as `snow-ui-dashboard-selfhosted` on `4200:4000` and sets `baseUrl: http://localhost:8080`.

`org-snow-angular-ui` still has `projects/docs` and `Dockerfile.docs`. `org-snow-angular-ui-selfhosted` does not.

`org-snow-angular-ui-selfhosted` also has `.github/workflows/master-org.code-workspace`. `org-snow-angular-ui` does not.

`.gitignore` in `org-snow-angular-ui-selfhosted` also ignores `.claude/` and `/github.client-secret`.

## Docs site

| | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| `projects/docs` | Present. Public markdown site, SSR, routes for home, modules, overview, reporting, `snow-monkeys/:mdFile`, and `get-started/:mdFile`. Provider examples use `providerExamplesMatcher` and `?file=` | Not in this checkout. `docs/DOCS_PROJECT.md` and `docs/DOCS_FORMAT.md` still describe that app and say not to add files under `projects/docs/` |
| `Dockerfile.docs` | Present | Not in this checkout |
| Docs compose service | `snow-ui-docs` on `4201:4000` | Not in `infra/docker-compose.yml` |

`projects/docs` in `org-snow-angular-ui` includes `hetzner-server.md`, `hetzner-resource.md`, `hetzner/examples/stateful/**`, `hetzner/examples/stateless/**`, and `cloudflare/examples/**`. Those files are not in `org-snow-angular-ui-selfhosted`.

## Repo documentation that drifted with the code

These files differ because they describe the small differences above. Several of them are behind the code.

| File | `org-snow-angular-ui` | `org-snow-angular-ui-selfhosted` |
|---|---|---|
| `AGENTS.md`, `CLAUDE.md` | Still say the API base is `http://localhost:8080/connectors`. The environment files use `https://api.snow-monkeys.com/connectors`. Deployments use `actorId`, `gitType`, and `type=ALL`. Auth is Firebase. Both still document the docs app | Describe the dashboard only. `CLAUDE.md` still names `FirebaseAuth` in the services list and `FIREBASE_SETUP.md`. The API sentence matches the code: host `http://localhost:8080`, `/connectors` paths in `config.ts`, deployments with no query params |
| `DESIGN.md` | Localhost `baseUrl`. No repository filter | Host `http://localhost:8080` with `/connectors` paths. Documents the repository filter and `localStorage` key |
| `README.md`, `projects/dashboard/README.md` | Sample `baseUrl` is localhost with `/connectors` on the host | Sample host is `http://localhost:8080` and each path includes `/connectors` |
| `SKILL.md` | Firebase / `FirebaseAuth`, plus the docs app | Dashboard only. Auth guidance is `DashboardAuth` and `docs/OAUTH_SETUP.md` |
| `docs/API.md` | Query-param deployments, color update, delete deployment, numeric `actorId` | No-query deployments, profile response includes `actor` / `actorId`, string `actorId`. Color and delete sections are absent |
| `docs/API_AUTHENTICATION_SECURITY.md` | Firebase bearer. Sample deployment GET includes query params | Sample GET has no query params |
| `docs/ARCHITECTURE.md` | Filter step is “apply filters” after the query-param GET | Names type, provider, color, name, and repository filters, including `localStorage` restore |
| `docs/BUSINESS_LOGIC.md` | Import flow marked deprecated. API color update, API liveness update, query-param load | Import flow marked deprecated. Repository filter, local card removal, local color and liveness on Sources, no-query load |
| `docs/COMPONENTS.md` | Import component marked deprecated. Color update described as an API call | Import component marked deprecated. Color update on Sources described as local. Documents `onRemove`, `confirmRemove`, and `cancelRemove` |
| `docs/QUICK_REFERENCE.md` | `loadSourceDeployments().subscribe()` and the query-param GET | `loadSourceDeployments()` and `filterSourceDeploymentsByRepository` |
| `docs/SERVICES.md` | Load is scoped by `actorId` and `gitType`. Remove calls DELETE | Load is unscoped. Documents the repository filter. Remove is local |

`org-snow-angular-ui-selfhosted` only: `docs/OAUTH_SETUP.md`, `docs/GITLAB_OAUTH.md`, `docs/TECH_DEBT.md`, and this file.

## File list

Auth, config, and app shell that exist or differ:

- `angular.json`, `tsconfig.json`, `package.json` (scripts only)
- `Dockerfile.docs` (`org-snow-angular-ui` only)
- `projects/docs/**` (`org-snow-angular-ui` only)
- `config.ts` (`org-snow-angular-ui-selfhosted`)
- `proxy.conf.js` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/main.ts`
- `projects/dashboard/src/main.server.ts`, `app.config.server.ts`, `app.routes.server.ts`, `server.ts` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/environments/environment.ts`
- `projects/dashboard/src/environments/environment.prod.ts` (`org-snow-angular-ui` only)
- `projects/dashboard/src/app/app.config.ts`
- `projects/dashboard/src/app/app.routes.ts`
- `projects/dashboard/src/app/guards/auth.guard.ts`
- `projects/dashboard/src/app/guards/first-time-entry.guard.ts` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/services/runtime-config.ts` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/services/auth/firebase-auth.ts` (`org-snow-angular-ui` only)
- `projects/dashboard/src/app/services/auth/gitlab-auth.ts`, `github-auth.ts`, `dashboard-auth.ts`, `auth-session.ts` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/interceptors/firebase-auth.interceptor.ts` (`org-snow-angular-ui` only)
- `projects/dashboard/src/app/interceptors/gitlab-auth.interceptor.ts` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/services/actions-api/self-hosted.api.ts` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/pages/login/login.ts`
- `projects/dashboard/src/app/pages/login/login.html`
- `projects/dashboard/src/app/pages/settings-first-time-configs/` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/pages/backend-unavailable/` (`org-snow-angular-ui-selfhosted`)
- `projects/dashboard/src/app/pages/dashboard/settings/settings.ts`
- `projects/dashboard/src/app/pages/dashboard/settings/settings.html`
- `projects/dashboard/src/app/shared/navbar/navbar.ts`
- `projects/dashboard/src/app/interfaces/model/auth-user.interface.ts` (`org-snow-angular-ui-selfhosted`)

Deployment and profile sources that differ:

- `projects/dashboard/src/app/services/actions-api/deployments-actions.api.ts`
- `projects/dashboard/src/app/services/actions-api/handle-profiles.api.ts`
- `projects/dashboard/src/app/services/actions-api/tabs-actions.api.ts` (`org-snow-angular-ui-selfhosted` reads the URL from `RuntimeConfig`)
- `projects/dashboard/src/app/services/handlers/handle-deployments-request.api.ts`
- `projects/dashboard/src/app/interfaces/api/api-deployment.interface.ts`
- `projects/dashboard/src/app/interfaces/api/api-profile.interface.ts`
- `projects/dashboard/src/app/interfaces/model/filters.interface.ts`
- `projects/dashboard/src/app/interfaces/model/source-deployment.interface.ts`
- `projects/dashboard/src/app/mapper/source-deployment.mapper.ts`
- `projects/dashboard/src/app/pages/dashboard/dashboard.ts`
- `projects/dashboard/src/app/pages/dashboard/sources/sources.ts`
- `projects/dashboard/src/app/pages/dashboard/sources/sources.html`
- `projects/dashboard/src/app/pages/dashboard/sources-history/sources-history.ts`
- `projects/dashboard/src/app/pages/dashboard/sources-history/sources-history.html`
- `projects/dashboard/src/app/components/card/card.ts`
- `projects/dashboard/src/app/components/card/card.html`
- `projects/dashboard/src/app/components/filters/filters.ts`
- `projects/dashboard/src/app/components/filters/filters.html`
- `projects/dashboard/src/app/components/import-git-reporitories/import-git-reporitories.ts`
- `projects/dashboard/src/app/components/import-git-reporitories/import-git-reporitories.html`

`card.ts` only drops commented-out color and liveness mutation blocks. Behavior of that file is otherwise the same.
