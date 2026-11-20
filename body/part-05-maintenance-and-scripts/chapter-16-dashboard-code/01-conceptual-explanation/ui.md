# Ui

The UI is the Angular 21 workspace in [org-snow-angular-ui](../../../../../org-snow-angular-ui/README.md). Three projects share that workspace. `npm start` serves **dashboard**. `npm run start:docs` serves **docs**. **snow-filters** is a library the apps build before they import it. Install with `npm install --legacy-peer-deps`.

| Project | Path | What it shows |
| --- | --- | --- |
| dashboard | `projects/dashboard/` | Login, deployments, history, settings, reports, licenses |
| docs | `projects/docs/` | Markdown site. Content is `projects/docs/public/md/` |
| snow-filters | `projects/snow-filters/` | Filter components. Not a site |

Stack, from the root README: Angular 21, Tailwind CSS 4, DaisyUI, Firebase Authentication with GitHub OAuth, Angular Signals. Components are standalone.

## Dashboard routes

Routes are `projects/dashboard/src/app/app.routes.ts`. The table matches [projects/dashboard/README.md](../../../../../org-snow-angular-ui/projects/dashboard/README.md).

| Path | Access | Screen |
| --- | --- | --- |
| `/login` | Public | Login |
| `/` | Redirect | `/dashboard` |
| `/dashboard` | `authGuard` | Sources, the deployment list |
| `/dashboard/history` | `authGuard` | Persistent deployment rows |
| `/dashboard/easy-deployment` | `authGuard` | Easy deployment. The navbar shows this when the license is `individual` or `business` |
| `/dashboard/reports` | `authGuard` | Reports. Same license check |
| `/dashboard/settings` | `authGuard` | Settings |
| `/dashboard/self-license` | `authGuard` | Self license |
| `/dashboard/individual-license` | `authGuard` | Individual license |
| `/dashboard-test` | No `authGuard` | Same shell, sources as the default child |
| other | Public | Not found |

`pages/dashboard/import/` is still in the tree. Its route is commented out in `app.routes.ts`. The navbar History link is `/dashboard/history`. Docs in the navbar open `https://docs.snow-monkeys.com/`.

The shell is `DashboardComponent`: navbar, tabs, then the child route. [docs/ARCHITECTURE.md](../../../../../org-snow-angular-ui/docs/ARCHITECTURE.md) draws that tree. Tabs come from `HandleTabs`. The sources page lists deployments for the signed-in GitHub `actorId`.

## Docs site

The docs app has no Firebase guard. A page is a markdown file under `projects/docs/public/md/`, a route in `projects/docs/src/app/app.routes.ts`, and the component that reads the `mdFile` param. [CLAUDE.md](../../../../../org-snow-angular-ui/CLAUDE.md) states that add-a-page order.
