# Docs Project

**Monorepo project:** Snow Angular UI (`snow-angular-ui`) — **docs** app

Public-facing documentation site for SnowMonkeys. No authentication required. Markdown-driven content served via `ngx-markdown`.

## Commands

```bash
ng serve docs                              # dev server
ng build docs                              # build
ng build docs --configuration production   # production build
```

## Architecture

```
projects/docs/src/app/
├── app.routes.ts                  # Route definitions
├── app.config.ts                  # App config (provideMarkdown, provideHttpClient)
├── pages/
│   ├── dashboard/                 # Shell layout (left-menu + router-outlet)
│   ├── home/                      # /docs/home
│   ├── overview/                  # /docs/overview
│   ├── modules/                   # /docs/modules (filterable module cards)
│   ├── snow-monkeys/              # /docs/snow-monkeys/:mdFile
│   ├── get-started/               # /docs/get-started/:mdFile
│   ├── provider/                  # /docs/provider/:provider/:mdFile
│   └── reporting/                 # /docs/reporting
├── components/
│   ├── docs-filters/              # Type + provider filter form
│   ├── modules-list/              # Filtered module card grid
│   └── module-card/               # Individual module card
├── shared/
│   └── left-menu/                 # Sidebar navigation
├── services/
│   └── handle-filters.ts          # Signal-based filter state
├── data/
│   └── modules-content-list.ts    # Static module definitions
└── interfaces/
    └── filters.interface.ts       # TypesForm interface
```

## Routes

| URL | Component | Content source |
|---|---|---|
| `/docs/home` | `home.ts` | `md/home/home.md` |
| `/docs/overview` | `overview.ts` | `md/overview/overview.md` |
| `/docs/modules` | `modules.ts` | Static data from `modules-content-list.ts` |
| `/docs/snow-monkeys/:mdFile` | `snow-monkeys.ts` | `md/snow-monkeys/<mdFile>.md` |
| `/docs/get-started/:mdFile` | `get-started.ts` | `md/get-started/<mdFile>.md` |
| `/docs/provider/:provider/:mdFile` | `provider.ts` | `md/providers/<provider>/<mdFile>.md` |
| `/docs/reporting` | `reporting.ts` | — |

Default redirect: `/` → `/docs/home`.

### Dynamic route params

**`snow-monkeys/:mdFile`** — resolves `mdFile` param to a path:

| param | file |
|---|---|
| `intro` | `md/snow-monkeys/intro.md` |
| `core` | `md/snow-monkeys/core-components.md` |
| `start` | `md/snow-monkeys/how-to-start.md` |

**`get-started/:mdFile`** — resolves `mdFile` param to a path:

| param | file |
|---|---|
| `local` | `md/get-started/local.md` |
| `web` | `md/get-started/web.md` |

**`provider/:provider/:mdFile`** — resolves both params dynamically to `md/providers/<provider>/<mdFile>.md`. No hardcoded mapping — any provider/file combination is supported as long as the `.md` file exists.

## Markdown content

All `.md` files are served as static assets from:

```
projects/docs/public/md/
├── home/
│   └── home.md
├── overview/
│   └── overview.md
├── snow-monkeys/
│   ├── intro.md
│   ├── core-components.md
│   └── how-to-start.md
├── get-started/
│   ├── local.md
│   └── web.md
└── providers/
    └── <provider>/
        └── <mdFile>.md
```

Pages load markdown with `<markdown [src]="markdownPath()">` from `ngx-markdown`. The path is a `computed()` signal derived from route params.

## Left menu (`shared/left-menu/`)

Static navigation component using `RouterLink` / `RouterLinkActive`. Uses DaisyUI `<details>` for collapsible sections. To add a new nav link, edit `left-menu.html` directly.

Current menu structure:
- **Home** (logo)
- Modules
- Overview
- Snow Monkeys (`intro`, `core`, `start`)
- Get Started (`local`, `web`)
- Reporting

## Modules page

The `/docs/modules` page shows filterable module cards. Data flow:

```
modules-content-list.ts  →  ModulesList (computed)  →  ModuleCard
                                   ↑
                             HandleFilters (signal)
                                   ↑
                             DocsFilters (form)
```

- `DocsFilters` renders a reactive form (type + provider toggles) and calls `HandleFilters.setFilters()` on change.
- `ModulesList` reads `HandleFilters.filters()` as a signal and recomputes the visible modules.
- Module entries in `modules-content-list.ts` have: `id`, `provider`, `name`, `type` (`application` | `service` | `cluster`), `link`, `page`, `description`.

## Adding a new doc page

1. Create the `.md` file under `projects/docs/public/md/<section>/<file>.md`.
2. Wire the route in `app.routes.ts`:
   - If using an existing dynamic page (`snow-monkeys`, `get-started`, `provider`), just add the `.md` file and a menu link — no code change needed for `provider/:provider/:mdFile`.
   - For `snow-monkeys` or `get-started`, also add the param mapping in the component's `markdownPath` computed.
3. Add a nav entry in `shared/left-menu/left-menu.html`.

## Adding a new module card

Edit `projects/docs/src/app/data/modules-content-list.ts` and append an entry:

```ts
{
  id: <unique number>,
  provider: 'hetzner' | 'docker' | 'civo' | 'cloudflare' | ...,
  name: 'Display name',
  type: 'service' | 'application' | 'cluster',
  link: 'https://external-docs-url',
  page: '/docs/provider/<provider>/<mdFile>',
  description: 'Short description shown on the card.'
}
```

The `provider` and `type` values must match a key in `TypesForm` to be affected by the filter.

## Stack

| Concern | Solution |
|---|---|
| Framework | Angular 21 standalone, zoneless |
| Markdown rendering | `ngx-markdown` |
| Styling | Tailwind CSS 4 + DaisyUI (`dracula` theme) |
| State | Angular Signals, `computed()` |
| DI | `inject()` |
| HTTP | `HttpClient` with `withFetch()` |
