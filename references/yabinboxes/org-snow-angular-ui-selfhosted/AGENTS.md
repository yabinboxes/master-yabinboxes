# Agent guidance (AGENTS.md)

Guidance for AI agents working in this repository.

## Project summary

**Project name:** Snow Angular UI  
**Package / repo:** `snow-angular-ui`

**Snow Angular UI** is an Angular 21 dashboard:

- **dashboard** — Deployments, user profiles, and repository import. Auth required. Talks to the backend API.

**Shared stack**: Angular 21, standalone components only (no NgModules), Tailwind CSS 4, DaisyUI. State: Angular Signals (`signal()`, `computed()`, `effect()`). Use `inject()` for dependencies.

---

## Workspace structure

| Project        | Path                      | Purpose |
|----------------|---------------------------|--------|
| **dashboard**  | `projects/dashboard/`      | Main app: deployments, import, settings, reports, licenses |

**Default project**: `npm start` / `ng serve` runs **dashboard**.

---

## Dashboard project

- **Auth**: Firebase (GitHub OAuth). Backend API host: `projects/dashboard/src/environments/environment.ts` (`http://localhost:8080`). Paths in `config.ts` include `/connectors`.
- **Routes**: `projects/dashboard/src/app/app.routes.ts` — `login` (public), `dashboard` (auth-guarded) with children: `''` (sources), `easy-deployment`, `settings`, `import`, `reports`, `self-license`, `individual-license`.
- **Key paths**:
  - **Routes**: `app.routes.ts`
  - **Guards**: `app/guards/` (e.g. `authGuard`)
  - **Pages**: `app/pages/dashboard/` (shell, sources, import, settings, reports, easy-deployment, license pages)
  - **Components**: `app/components/` (card, card-list, filters, import-git-reporitories)
  - **Shared**: `app/shared/` (navbar)
  - **Services**: `app/services/` (auth, handlers, actions-api)
  - **Interfaces**: `app/interfaces/` — `api/`, `model/` (license, user-profile, source-deployment, api-github, api-deployment, api-profile, api-tabs, filters, menu-option)
  - **Environment**: `projects/dashboard/src/environments/environment.ts`

**Commands**:
```bash
ng serve                      # or npm start — serve dashboard
ng build dashboard            # development
ng build dashboard --configuration production
ng test                       # uses dashboard test config by default
```

Business Logic:

- Dashboard has to retrieve user profile and tabs before rendering sources
- Tabs should be rendered properly in card-list and in case of empty tabs then print error 

---

## Conventions

- **Components**: Standalone; `inject()` for dependencies; expose readonly signals for template binding.
- **Templates**: Prefer control flow (`@if`, `@for`, `@switch`) over `*ngIf`/`*ngFor`.
- **Forms**: Reactive forms (`FormBuilder`, `FormGroup`); bind with `[formGroup]` and `formControlName`.
- **Routes**: Lazy-loaded via `loadComponent: () => import('...')`.
- **Naming**: Kebab-case for files/folders (e.g. `import-git-reporitories` — note existing typo “reporitories” in dashboard).

**Dashboard-specific**: Protected routes use `canActivate: [authGuard]`. Auth-dependent API calls use profile/`actorId`/`gitType` from `DashboardAuth` or `HandleProfiles`. Snow API JSON/query fields use camelCase. Profile response may include `gitType`.

---

## Documentation (repo-level)

- **README.md** — Overview, features, getting started, project structure.
- **docs/COMPONENTS.md** — Dashboard component API (card, filters, import-git-reporitories, navbar, pages).
- **docs/SERVICES.md** — Dashboard service APIs.
- **docs/ARCHITECTURE.md** — Architecture, data flow, routing, state.
- **docs/DEVELOPMENT.md** — Dev workflow, code style, testing.
- **docs/QUICK_REFERENCE.md** — Snippets (signals, inject, HTTP, styling).
- **docs/API.md** — Backend API reference (dashboard).
- **docs/API_AUTHENTICATION_SECURITY.md** — Firebase Bearer auth for connectors APIs, guards, threat model.
- **projects/dashboard/FIREBASE_SETUP.md** — Firebase configuration for dashboard.

---

## When editing

- Prefer existing patterns (signals, inject, standalone, Tailwind/DaisyUI).
- **Dashboard**: Keep route guards on protected routes; use DaisyUI classes for new UI (`base-content`, `btn-primary`, `loading loading-dots`). Run `ng build dashboard` before considering the change complete.
