# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in **Snow Angular UI** (`snow-angular-ui`).

## Commands

```bash
# Install (always use --legacy-peer-deps)
npm install --legacy-peer-deps

# Serve
npm start                              # dashboard

# Build (run before considering a change complete)
ng build dashboard
ng build dashboard --configuration production

# Test
ng test                                # dashboard
ng test dashboard
```

## Architecture

Angular 21 workspace with one application:

| Project | Path | Notes |
|---|---|---|
| **dashboard** | `projects/dashboard/` | Deployments, import, settings, reports, licenses. GitLab or GitHub OAuth. |

**Stack**: Angular 21 standalone components, Tailwind CSS 4, DaisyUI (`dracula` theme), Angular Signals for state, `inject()` for dependency injection.

### Dashboard internals

- **Routes** (`app.routes.ts`): `login` (public) → `dashboard` (auth-guarded) with children `''` (sources), `easy-deployment`, `settings`, `import`, `reports`, `self-license`, `individual-license`. All lazy-loaded via `loadComponent`.
- **Services** (`app/services/`): `FirebaseAuth` (auth), `HandleProfiles` (profile/license/token), `HandleDeploymentsRequest` (deployments + filtering), `NotificationDeployment` (WebSocket with auto-reconnect).
- **API base URL**: configured in `projects/dashboard/src/environments/environment.ts` (`http://localhost:8080`). Paths in `config.ts` include `/connectors`.
- **Business logic constraint**: The dashboard must retrieve user profile and tabs before rendering sources. Tabs must be rendered in `card-list`; show an error state for empty tabs. Deployments are fetched with `GET /connectors/get-snow-deployments` and no query parameters. Profile POST body is camelCase: `{ email, actorId?, actor?, gitType? }`. Profile response may include `actor`, `actorId`, and `gitType`.

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


