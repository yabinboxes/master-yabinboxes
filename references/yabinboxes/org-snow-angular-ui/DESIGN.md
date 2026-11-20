# DESIGN.md

**Project:** Snow Angular UI (`snow-angular-ui`)

Design decisions, visual system, and UI patterns for the Snow Angular UI monorepo.

---

## Visual System

### Theme

Both apps use **DaisyUI v5** with the `dracula` theme (`--default`). This is a dark theme applied globally via the PostCSS plugin declaration in `styles.css`:

```css
@plugin "daisyui" {
  themes: dracula --default;
}
```

The body background is set to `bg-base-200` (a slightly lighter dark shade than `bg-base-100`) to create depth between the page background and card surfaces.

### Typography

- **Font**: DaisyUI/Dracula theme defaults (system sans-serif stack)
- **Markdown content** (docs app): rendered via `ngx-markdown` with `@tailwindcss/typography` (`prose` classes) for readable long-form text
- **Icons**: Lucide Angular — SVG-based, `stroke-width: 1`, sized at 16×16 px (`svg.my-icon`) or 15×15 px (`svg.my-icon-link`)

### Color Language

| Purpose | Token / Class |
|---|---|
| Page background | `bg-base-200` |
| Card / surface | `bg-base-100` |
| Primary actions | `btn-primary` |
| Text | `base-content` |
| Loading states | `loading loading-dots` |
| Deployment tag — blue | `blue-500` |
| Deployment tag — green | `green-500` |
| Deployment tag — red | `red-500` |
| Deployment tag — yellow | `yellow-500` |
| Deployment tag — orange | `orange-500` |
| No tag | (no color class) |

Color tags (`CardColor`) are user-assigned metadata on deployments. They serve as a visual organization tool — not status indicators.

---

## Layout Patterns

### Dashboard Shell

```
┌──────────────────────────────────────────────┐
│  Navbar (top, full-width)                    │
├──────────────────────────────────────────────┤
│  Tabs (horizontal, dynamic)                  │
├──────────────────────────────────────────────┤
│                                              │
│  Router Outlet (main content area)           │
│                                              │
└──────────────────────────────────────────────┘
```

- `app-root` and `.router-container` fill 100% viewport height
- The navbar is a `snow-navbar` shared component rendered inside the dashboard shell
- Tabs above the router outlet are driven by the `HandleTabs` service; they must always contain at least one tab

### Docs Shell

```
┌────────────┬─────────────────────────────────┐
│            │                                 │
│ Left Menu  │  Router Outlet (markdown view)  │
│ (sidebar)  │                                 │
│            │                                 │
└────────────┴─────────────────────────────────┘
```

- Left menu shows the SnowMonkeys wordmark and icon in the sidebar header
- Content area renders markdown via `ngx-markdown`

---

## Component Design

### Card (`card/`)

The core unit of the dashboard. Each card represents one `SourceDeployment`.

**Visual anatomy:**
- Header: source name, type badge, provider icon(s)
- Color strip: left border or top accent in the assigned `CardColor`
- Body: liveness status, updated date (formatted MM/DD/YYYY), description
- Footer: health check URL link

**Interactions:**
- Click anywhere → opens a detail modal
- Color palette toggle → inline 6-color + clear selector (not a modal)
- Liveness status → dropdown to change state

**Design decision**: The color palette is inline (not a separate modal) to keep the tagging action lightweight and fast — users tag many deployments at once.

### Card List (`card-list/`)

A responsive grid/flex container for cards. Receives the filtered deployment list from the parent (sources page) and renders `app-card` for each item. Empty state is handled here if the tab list is empty — an error state component is shown rather than an empty grid.

### Filters (`filters/`)

A sidebar or panel with three checkbox groups:

| Group | Options |
|---|---|
| Source type | Application, Service, Cluster |
| Provider | AWS, Azure, DigitalOcean, Cloudflare, Civo |
| Color tag | Blue, Green, Red, Yellow, Orange, No color |

Built as a reactive `FormGroup<TypesForm>`. Changes are emitted immediately (no submit button) for real-time filtering. The `HandleDeploymentsRequest` service owns the filter state and applies it to the deployment signal.

### Navbar (`navbar/`)

Top bar present across all authenticated dashboard pages.

**Contents:**
- Left: app logo / title
- Right: user avatar (from Firebase `photoURL`), dropdown menu

**Conditional menu items:**
- Reports link is hidden when `license === 'self'`

**Design decision**: License-based visibility is enforced in the navbar template rather than the router, so the route still exists but the entry point is hidden — avoids redirect complexity while keeping the guard as a fallback.

### Import Git Repositories (`import-git-reporitories/`)

**Deprecated.** This screen is not routed.

Multi-step workflow (note: folder name has a typo — preserved intentionally):

1. **Token input** — user provides a GitHub personal access token
2. **Repo list** — fetched via GitHub API (TanStack Query for caching); checkboxes + "select all" toggle
3. **Type assignment** — per-repo dropdown: defaults to `Service`, auto-sets `Application` if repo language is HCL (Terraform)
4. **Publish** — POST to backend; shows "Publishing..." → "Redirecting..." → navigates to dashboard

**Design decision**: The HCL → Application default mapping is a product-level assumption: HCL repos typically represent infrastructure-as-code applications rather than plain services.

---

## State & Data Flow Design

### Signal-First State

All mutable UI state lives in Angular Signals. Services expose `readonly` signals; components read them directly in templates (Angular's reactivity handles change detection).

```
Service (signal<T>) → readonly signal → Template binding
                    → computed()      → Derived display values
                    → effect()        → Side effects (logging, WebSocket triggers)
```

### Loading & Auth Sequencing

The dashboard **must** load the user profile and tabs before rendering the sources page. This is a business logic constraint, not just UX: tabs determine which deployment groups to display. The guard (`authGuard`) ensures the user is authenticated first; the dashboard page component waits for `HandleProfiles` signals before rendering `card-list`.

### Real-time Updates (WebSocket)

`NotificationDeployment` connects on app initialization and pushes deployment updates into the `sourceDeployments` signal. The WebSocket uses exponential backoff (max 5 reconnect attempts). Components react automatically via signal bindings — no explicit subscription management in components.

---

## Routing Design

### Authentication Boundary

```
/login          — public, GitHub OAuth entry
/dashboard/**   — canActivate: [authGuard] (all children)
/**             — 404 (NotFound component)
```

All dashboard children are lazy-loaded (`loadComponent`) to keep the initial bundle small.

### Docs Routes

Dynamic markdown routes resolve a route param to a file path:

```
/snow-monkeys/:mdFile  →  md/snow-monkeys/{mdFile}.md
/get-started/:mdFile   →  md/get-started/{mdFile}.md
/provider/:provider/:mdFile → md/providers/{provider}/{mdFile}.md
```

Adding a new doc page requires: (1) the `.md` file, (2) the route entry, (3) wiring the param in the page component.

---

## Shared Libraries

### `snow-filters`

Exported filter component shell. Selector: `snow-filters`. Currently a minimal implementation; intended for use across both apps when the filter UI is extracted.

**Build note**: This library must be built (`npm run build:snow-filters`) before consuming apps can see updated changes, because the path alias in `tsconfig.json` points to `dist/`.

---

## API & Environment Design

### Endpoint Configuration

All API paths are centralized in `environment.ts`:

```typescript
api: {
  baseUrl: 'http://localhost:8080/connectors',
  endpoints: {
    profile: '/profile',
    profileLicense: '/profile/license',
    profileToken: '/profile/snow-token-pipeline',
    snowDeployments: '/get-snow-deployments',
    tabs: '/tabs'
  }
}
```

Swap `baseUrl` if pointing at a remote backend. All Snow API JSON fields and query params use **camelCase** (e.g. `actorId`, `livenessType`).

### Data Mapping

API responses are transformed by `SourceDeploymentMapper` before being stored in signals. Raw API types (`APISnowDeploymentResponse`) are kept separate from UI model types (`SourceDeployment`) — this isolates the UI from backend schema changes.

---

## Key Type Definitions

```typescript
type SourceType  = 'application' | 'service' | 'cluster';
type ProviderType = 'digitalocean' | 'cloudflare' | 'civo' | 'azure' | 'aws' | '';
type CardColor   = '' | 'blue' | 'green' | 'red' | 'yellow' | 'orange';
type LicenseType = 'self' | 'individual' | 'business' | 'empty';
```

These are the core discriminated unions that drive conditional rendering, filtering, and license-gated features throughout the dashboard.

---

## Conventions Summary

| Concern | Decision |
|---|---|
| Component style | Standalone only, no NgModules |
| Dependency injection | `inject()` in class body, no constructor params |
| State | Angular Signals; expose `readonly` from services |
| Templates | `@if`, `@for`, `@switch` — not `*ngIf`/`*ngFor` |
| Forms | Reactive (`FormBuilder` / `FormGroup`) |
| Styling | DaisyUI utility classes; Tailwind for layout |
| Routing | Lazy-loaded via `loadComponent`; auth via `authGuard` |
| File naming | kebab-case (including the `import-git-reporitories` typo) |
| Comments | Only for non-obvious constraints or workarounds |

---

## Further Reference

| Document | Location |
|---|---|
| Architecture (data flow, service graph) | `docs/ARCHITECTURE.md` |
| Component API details | `docs/COMPONENTS.md` |
| Service API details | `docs/SERVICES.md` |
| Backend API endpoints | `docs/API.md` |
| Development workflows | `docs/DEVELOPMENT.md` |
| Firebase setup | `projects/dashboard/FIREBASE_SETUP.md` |
| AI agent guidance | `AGENTS.md` |
