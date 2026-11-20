# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in **Snow Angular UI** (`snow-angular-ui`).

## Commands

```bash
# Install (always use --legacy-peer-deps)
npm install --legacy-peer-deps

# Serve
npm start                              # dashboard (default)
ng serve docs                          # docs app

# Build (run before considering a change complete)
ng build dashboard
ng build dashboard --configuration production
ng build docs
ng build docs --configuration production

# Test
ng test                                # dashboard (default)
ng test dashboard
ng test docs
```

## Architecture

Angular 21 monorepo with three projects:

| Project | Path | Notes |
|---|---|---|
| **dashboard** | `projects/dashboard/` | Main app — deployments, history, settings, reports, licenses. Firebase GitHub OAuth required. |
| **docs** | `projects/docs/` | Public docs site — markdown-driven, no auth. Uses ngx-markdown. |
| **snow-filters** | `projects/snow-filters/` | Shared filter component library |

Shared libraries are consumed via path aliases in `tsconfig.json` pointing to `dist/` — build them first if they change.

**Stack**: Angular 21 standalone components, Tailwind CSS 4, DaisyUI (`dracula` theme), Angular Signals for state, `inject()` for dependency injection.

### Dashboard internals

- **Routes** (`app.routes.ts`): `login` (public) → `dashboard` (auth-guarded) with children `''` (sources), `history`, `easy-deployment`, `settings`, `reports`, `self-license`, `individual-license`. `import` is commented out and is not a route. `dashboard-test` loads the same shell without `authGuard`. All lazy-loaded via `loadComponent`.
- **Services** (`app/services/`): `FirebaseAuth` (auth), `HandleProfiles` and `HandleProfilesApi` (profile/license/token), `HandleTabs` and `TabsActionsApi` (tabs), `HandleDeploymentsRequest` and `DeploymentsActionsApi` (deployments, history, color), `GithubActionsApi` (GitHub REST), `NotificationDeployment` (WebSocket with auto-reconnect).
- **API base URL**: `projects/dashboard/src/environments/environment.ts` sets `api.baseUrl` to `https://api.snow-monkeys.com/connectors`. Endpoints are `profile`, `profileLicense`, `profileToken`, `snowDeployments`, `snowDeploymentsPersistent`, and `tabs`.
- **Business logic constraint**: The dashboard must retrieve user profile and tabs before rendering sources. Tabs must be rendered in `card-list`; show an error state for empty tabs. Deployments are fetched with `actorId` and `gitType` (`GET /get-snow-deployments?actorId=…&gitType=…&type=ALL`). Profile POST body is camelCase: `{ email, actorId?, actor?, gitType? }`. Profile response may include `gitType`, which updates `UserProfile.gitType`.

### Docs internals

- Content is markdown files under `projects/docs/public/md/` (mirroring route structure).
- Dynamic routes: `snow-monkeys/:mdFile` and `get-started/:mdFile` resolve the param to a path like `md/get-started/local.md`.
- To add a doc page: add the `.md` file, wire the route in `app.routes.ts`, and update the page component that resolves the `mdFile` param.

## Conventions

- **Components**: Standalone only; use `inject()` for dependencies; expose state as readonly signals.
- **Templates**: Control flow syntax — `@if`, `@for`, `@switch` (not `*ngIf`/`*ngFor`).
- **Forms**: Reactive forms with `FormBuilder` / `FormGroup`.
- **Styling**: DaisyUI utility classes (`btn-primary`, `base-content`, `loading loading-dots`, etc.).
- **Naming**: kebab-case for all files and folders. Note: the existing `import-git-reporitories` folder has a typo — preserve it when referencing.
- **Route guards**: All protected routes must keep `canActivate: [authGuard]`.

## Further reference

- **AGENTS.md** — Detailed key paths, route maps, and per-project guidance (same repo root).
- **docs/ARCHITECTURE.md**, **docs/SERVICES.md**, **docs/COMPONENTS.md**, **docs/API.md** — In-depth reference.
- **projects/dashboard/FIREBASE_SETUP.md** — Firebase configuration instructions.


