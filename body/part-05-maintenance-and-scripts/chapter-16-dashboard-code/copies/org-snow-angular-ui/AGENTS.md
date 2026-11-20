# Agent guidance (AGENTS.md)

Guidance for AI agents working in this repository.

## Project summary

**Project name:** Snow Angular UI  
**Package / repo:** `snow-angular-ui`

**Snow Angular UI** is an Angular 21 monorepo with two main applications and shared libraries:

- **dashboard** — Main app: deployments, user profiles, history. Auth required (Firebase GitHub OAuth). Talks to backend API.
- **docs** — Documentation site: markdown-driven content, left menu, no auth. Uses ngx-markdown; content lives under `public/md/`.
- **snow-filters** — Shared filter library (dashboard and/or docs may use it).

**Shared stack**: Angular 21, standalone components only (no NgModules), Tailwind CSS 4, DaisyUI. State: Angular Signals (`signal()`, `computed()`, `effect()`). Use `inject()` for dependencies.

---

## Workspace structure

| Project        | Path                      | Purpose |
|----------------|---------------------------|--------|
| **dashboard**  | `projects/dashboard/`      | Main app: deployments, history, settings, reports, licenses |
| **docs**       | `projects/docs/`          | Docs site: markdown pages, left menu, modules/overview/reporting |
| **snow-filters** | `projects/snow-filters/` | Filter component library |

**Default project**: `npm start` / `ng serve` runs **dashboard**. Use `ng serve docs` to run the docs app.

---

## Dashboard project

- **Auth**: Firebase (GitHub OAuth). Backend API base: `projects/dashboard/src/environments/environment.ts` (default `http://localhost:8080/connectors`).
- **Routes**: `projects/dashboard/src/app/app.routes.ts` — `login` (public), `dashboard` (auth-guarded) with children: `''` (sources), `history`, `easy-deployment`, `settings`, `reports`, `self-license`, `individual-license`. The `import` route is commented out. `dashboard-test` repeats the shell without `authGuard`.
- **Key paths**:
  - **Routes**: `app.routes.ts`
  - **Guards**: `app/guards/` (e.g. `authGuard`)
  - **Pages**: `app/pages/dashboard/` (shell, sources, sources-history, settings, reports, easy-deployment, license pages). `import/` remains on disk and is not routed.
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

## Docs project

- **No auth**. Content is markdown under `projects/docs/public/md/` (e.g. `home/home.md`, `get-started/local.md`, `snow-monkeys/intro.md`, `overview/overview.md`, `reporting/reporting.md`). Rendered with **ngx-markdown**.
- **Routes**: `projects/docs/src/app/app.routes.ts` — default redirect to `docs/home`; under `docs`:
  - `home`, `modules`, `overview`, `reporting` (static routes)
  - `snow-monkeys/:mdFile`, `get-started/:mdFile` (markdown by param; map to files under `public/md/`)
- **Key paths**:
  - **Routes**: `projects/docs/src/app/app.routes.ts`
  - **Pages**: `app/pages/` — `dashboard/` (shell with left menu + outlet), `home/`, `modules/`, `overview/`, `get-started/`, `snow-monkeys/`, `reporting/`, `pending/` (e.g. dev, iac, provider, landing)
  - **Shared**: `app/shared/left-menu/` (sidebar nav)
  - **Components**: `app/components/` (e.g. module-card, modules-list, docs-filters)
  - **Markdown content**: `projects/docs/public/md/` — structure mirrors routes (get-started/, snow-monkeys/, overview/, reporting/, home/, etc.)
  - **Interfaces / services**: `app/interfaces/`, `app/services/` (e.g. filters), `app/data/` (e.g. modules)

**Commands**:
```bash
ng serve docs                 # dev server (CSR during development)
ng build docs                 # SSR build (browser + server bundles)
ng build docs --configuration production
npm run serve:ssr:docs        # run SSR server after build (default port 4000)
```

---

## Conventions (both apps)

- **Components**: Standalone; `inject()` for dependencies; expose readonly signals for template binding.
- **Templates**: Prefer control flow (`@if`, `@for`, `@switch`) over `*ngIf`/`*ngFor`.
- **Forms**: Reactive forms (`FormBuilder`, `FormGroup`); bind with `[formGroup]` and `formControlName`.
- **Routes**: Lazy-loaded via `loadComponent: () => import('...')`.
- **Naming**: Kebab-case for files/folders (e.g. `import-git-reporitories` — note existing typo “reporitories” in dashboard).

**Dashboard-specific**: Protected routes use `canActivate: [authGuard]`. Auth-dependent API calls use profile/`actorId`/`gitType` from `FirebaseAuth` or `HandleProfiles`. Snow API JSON/query fields use camelCase. Profile response may include `gitType`.

**Docs-specific**: Add new doc content as `.md` in `public/md/` and wire route/param in `app.routes.ts` and the page component (e.g. `get-started`, `snow-monkeys`) that resolves `mdFile` to a path like `md/get-started/local.md`.

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
- **Docs**: Add or edit markdown in `projects/docs/public/md/`; ensure route and page component resolve the correct `md/...` path. Run `ng build docs` before considering the change complete.
