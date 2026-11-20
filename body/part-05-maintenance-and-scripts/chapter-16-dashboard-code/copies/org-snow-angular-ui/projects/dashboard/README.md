# Dashboard

**Project:** Snow Angular UI (`snow-angular-ui`) — **dashboard** app

Main application in the Snow Angular UI monorepo. Manages deployments, deployment history, user profiles, license, and pipeline tokens. Requires Firebase GitHub OAuth.

## Quick Start

```bash
# From the monorepo root
npm install --legacy-peer-deps
npm start               # serves at http://localhost:4200
```

## Build

```bash
ng build dashboard                            # development
ng build dashboard --configuration production # production
```

## Test

```bash
ng test dashboard
```

## Project Structure

```
projects/dashboard/src/
├── app/
│   ├── services/
│   │   ├── actions-api/            # HTTP calls
│   │   │   ├── deployments-actions.api.ts
│   │   │   ├── github-actions.api.ts
│   │   │   ├── handle-profiles.api.ts
│   │   │   └── tabs-actions.api.ts
│   │   ├── auth/                   # FirebaseAuth
│   │   ├── handlers/               # HandleProfiles, HandleTabs, HandleDeploymentsRequest
│   │   └── notifications/          # NotificationDeployment WebSocket
│   ├── components/                 # Reusable UI components
│   │   ├── card/                   # Deployment card
│   │   ├── card-list/              # Card grid with tab bar
│   │   ├── filters/                # Source type / provider / color filters
│   │   └── import-git-reporitories/ # GitHub import workflow
│   ├── guards/
│   │   └── auth.guard.ts           # Protects /dashboard routes
│   ├── interfaces/
│   │   ├── api/                    # API request/response types
│   │   └── model/                  # UI model types (SourceDeployment, etc.)
│   ├── pages/
│   │   ├── dashboard/              # Main shell + child pages
│   │   │   ├── easy-deployment/
│   │   │   ├── import/
│   │   │   ├── reports/
│   │   │   ├── self-license/
│   │   │   ├── individual-license/
│   │   │   ├── settings/
│   │   │   └── sources/            # Default child — deployment list
│   │   ├── login/                  # GitHub OAuth page
│   │   └── notfound/               # 404
│   ├── services/                   # State management
│   │   ├── firebase-auth.ts        # Firebase authentication
│   │   ├── handle-deployments-request.api.ts  # Deployment state + filtering
│   │   ├── handle-profiles.ts      # User profile + license state
│   │   ├── handle-tabs.ts          # Dashboard tab state
│   │   └── notification-deployment.websocket.ts  # WebSocket for live updates
│   └── shared/
│       └── navbar/                 # Top navigation bar
├── environments/
│   ├── environment.ts              # Dev config (API URL, Firebase keys)
│   └── environment.prod.ts
└── styles.css                      # Tailwind CSS 4 + DaisyUI (dracula theme)
```

## Routes

| Path | Access | Component |
|---|---|---|
| `/login` | Public | LoginComponent |
| `/dashboard` | Auth-guarded | DashboardComponent |
| `/dashboard` (default) | Auth-guarded | SourcesComponent |
| `/dashboard/history` | Auth-guarded | SourcesHistoryComponent |
| `/dashboard/easy-deployment` | Auth-guarded | EasyDeploymentComponent. Navbar shows this link when the license is `individual` or `business` |
| `/dashboard/reports` | Auth-guarded | ReportsComponent. Same license check as Easy deployment |
| `/dashboard-test` | No `authGuard` | Same shell as `/dashboard`, default child is sources |
| `/dashboard/settings` | Auth-guarded | SettingsComponent |
| `/dashboard/self-license` | Auth-guarded | SelfLicenseComponent |
| `/dashboard/individual-license` | Auth-guarded | IndividualLicenseComponent |

All routes under `/dashboard` use `canActivate: [authGuard]`. All components are lazy-loaded via `loadComponent`.

## Environment Configuration

Edit `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: { /* Firebase project config */ },
  api: {
    baseUrl: 'https://api.snow-monkeys.com/connectors',
    endpoints: {
      profile: '/profile',
      profileLicense: '/profile/license',
      profileToken: '/profile/snow-token-pipeline',
      snowDeployments: '/get-snow-deployments',
      snowDeploymentsPersistent: '/get-snow-deployments-persistent',
      tabs: '/tabs'
    }
  }
};
```

Snow API JSON and query params use camelCase (e.g. `actorId`, `gitType`). Profile response may include `gitType`.

See `FIREBASE_SETUP.md` in this directory for Firebase project configuration.

## Key Services

| Service | Responsibility |
|---|---|
| `FirebaseAuth` | GitHub OAuth, auth state signals |
| `HandleProfiles` | Profile, license, token signals |
| `HandleDeploymentsRequest` | Deployment list, filtering, search, WebSocket updates |
| `HandleTabs` | Tab CRUD, active tab state |
| `NotificationDeployment` | WebSocket connection with auto-reconnect |

All services use Angular Signals for state. Expose `readonly` signals to components.

## Business Logic

See `docs/BUSINESS_LOGIC.md` in the repo root for detailed workflows including:
- Authentication and profile loading sequence
- Deployment loading, filtering, and real-time updates
- GitHub import flow and snow type mapping
- License management and feature gating
- Tab management and deletion rules

## Tech Stack

- Angular 21 (standalone components)
- Tailwind CSS 4 + DaisyUI (`dracula` theme)
- Angular Signals for state management
- TanStack Angular Query for HTTP queries and mutations
- Firebase Authentication (GitHub OAuth)
- Lucide Angular icons
- RxJS for WebSocket streams
