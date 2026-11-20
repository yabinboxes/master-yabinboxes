# Docs

**Monorepo project:** Snow Angular UI (`snow-angular-ui`) — **docs** app

Public documentation site for SnowMonkeys. Markdown-driven, no authentication required. Built with Angular 21 and ngx-markdown.

## Quick Start

```bash
# From the monorepo root
npm install --legacy-peer-deps
ng serve docs               # serves at http://localhost:4200
```

## Build

```bash
ng build docs                            # development
ng build docs --configuration production # production
```

## Project Structure

```
projects/docs/src/
├── app/
│   ├── components/
│   │   ├── docs-filters/       # Filter UI for docs pages
│   │   ├── module-card/        # Card for modules list
│   │   └── modules-list/       # Modules index container
│   ├── pages/
│   │   ├── dashboard/          # App shell with left sidebar + router outlet
│   │   ├── home/               # Landing page
│   │   ├── modules/            # Modules index page
│   │   ├── overview/           # Overview page
│   │   ├── reporting/          # Reporting docs page
│   │   ├── get-started/        # Dynamic markdown page (:mdFile param)
│   │   ├── provider/           # Dynamic markdown page (:provider/:mdFile params)
│   │   └── snow-monkeys/       # Dynamic markdown page (:mdFile param)
│   └── shared/
│       └── left-menu/          # Sidebar navigation
└── styles.css                  # Tailwind CSS 4 + DaisyUI (dracula theme)

projects/docs/public/md/        # Markdown content files
├── home/home.md
├── get-started/
│   ├── web.md
│   └── local.md
├── snow-monkeys/
│   ├── intro.md
│   ├── how-to-start.md
│   └── core-components.md
├── overview/overview.md
├── reporting/reporting.md
├── providers/
│   ├── docker/
│   ├── hetzner/
│   ├── civo/
│   ├── digitalocean/
│   ├── cloudflare/
│   ├── aws/
│   └── azure/
└── deprecated/installation.md
```

## Routes

| Path | Component | Notes |
|---|---|---|
| `/` | redirect | → `/docs/home` |
| `/docs/home` | HomeComponent | |
| `/docs/modules` | ModulesComponent | |
| `/docs/overview` | OverviewComponent | |
| `/docs/reporting` | ReportingComponent | |
| `/docs/snow-monkeys/:mdFile` | SnowMonkeysComponent | loads `md/snow-monkeys/{mdFile}.md` |
| `/docs/get-started/:mdFile` | GetStartedComponent | loads `md/get-started/{mdFile}.md` |
| `/docs/provider/:provider/:mdFile` | ProviderComponent | loads `md/providers/{provider}/{mdFile}.md` |
| `/docs/provider/:provider/examples` | ProviderExampleComponent | loads `md/providers/{provider}/examples/README.md` |
| `/docs/provider/:provider/examples?file=` | ProviderExampleComponent | loads a nested example file (`.md`, `.yml`, `.sh`, …) |

## Adding a Doc Page

1. Create the `.md` file under `public/md/` mirroring the route path
2. Add the route to `src/app/app.routes.ts`
3. Wire the `mdFile` (or `provider`/`mdFile`) param in the page component to resolve the file path
4. Add a link to the left menu if needed

## Markdown Rendering

Content is rendered via `ngx-markdown` with `@tailwindcss/typography` (`prose` classes) for readable long-form text. Images and assets placed in `public/` are served statically.

## Tech Stack

- Angular 21 (standalone components)
- Tailwind CSS 4 + DaisyUI (`dracula` theme)
- ngx-markdown for content rendering
- `@tailwindcss/typography` for prose styling
