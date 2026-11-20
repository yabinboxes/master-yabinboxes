# Snow Angular UI

**Project name:** Snow Angular UI  
**Package / repo:** `snow-angular-ui`

A modern Angular application for managing deployments, monitoring repositories, and managing user profiles with Firebase authentication.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Run from scratch](#run-from-scratch)
  - [Dashboard](#a-run-dashboard-from-scratch)
  - [Docker](#e-run-prebuilt-images-with-docker-no-npm)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Services](#services)
- [Configuration](#configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

Snow Angular UI is an Angular workspace with one application:

- **Dashboard**: Application for managing deployments and user settings

### Tech Stack

- **Framework**: Angular 21
- **Styling**: Tailwind CSS 4, DaisyUI
- **Authentication**: Firebase Authentication (GitHub OAuth)
- **Icons**: Lucide Angular
- **Markdown**: ngx-markdown
- **State Management**: Angular Signals

## ✨ Features

### Dashboard Application

- 🔐 **Firebase Authentication** - GitHub OAuth integration
- 📊 **Deployment Management** - View and manage source deployments
- 🎨 **Color Tagging** - Organize deployments with color tags
- 🔍 **Advanced Filtering** - Filter by type, provider, and color
- 📝 **License Management** - Self, Individual, and Business license types
- 🔑 **Pipeline Token Management** - Generate and manage pipeline tokens
- ⚡ **Real-time Updates** - WebSocket integration for live deployment updates
- 📱 **Responsive Design** - Mobile-first responsive UI
- 📥 **Import Git Repositories** - Deprecated. The screen is not routed, and publishing repositories from it is not implemented.
- 📑 **Dynamic Dashboard Tabs** - Multiple tabs with a default tab (main content) and add/remove tab support

### Key Capabilities

- Filter deployments by:
  - Source Type (Service, Application, Cluster, Resource)
  - Cloud Provider (AWS, Azure, DigitalOcean, Cloudflare, Civo)
  - Color Tags (Blue, Green, Red, Yellow, Orange, No Color)
- Search deployments by name
- Filter the card list by repository (value is kept in local storage)
- Update deployment colors via API
- Manage user profile and license settings
- View license terms in markdown format

## 🚀 Run from scratch

Do these steps in order. Every command runs from the **monorepo root** (`snow-angular-ui/`). Prefer the `npm` scripts so you do not need a global Angular CLI.

There is one workspace project:

| Project | What it is | You open it at |
|---|---|---|
| **dashboard** | App (login, deployments, settings) | http://localhost:4200 |

### Step 0 — Prerequisites

1. Install **Node.js 20+** (includes npm).
2. Confirm both work:

```bash
node -v
npm -v
```

You should see Node `v20` or higher. You do **not** need a global `ng` install.

### Step 1 — Get into the repo

```bash
cd snow-angular-ui
```

If you do not have the repo yet:

```bash
git clone <repository-url>
cd snow-angular-ui
```

### Step 2 — Install dependencies (required, do not skip)

```bash
npm install --legacy-peer-deps
```

Wait until this finishes with no errors. `node_modules/` must exist before any start command.

**Do not run `npm install` without `--legacy-peer-deps`.** Peer deps conflict (`ERESOLVE`) and install fails. Then `ng serve` dies with *Node packages may not be installed*.

If you already ran a broken install:

```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Step 3 — Pick one of the recipes below

These npm scripts are real (`package.json`):

```bash
npm run start:dashboard
npm run build:dashboard
```

---

### A. Run dashboard from scratch

Firebase config and the API URL are already in `projects/dashboard/src/environments/environment.ts`. You do not need to edit them for a first local run.

1. Finish **Step 0–2** above.
2. Start the dashboard:

```bash
npm run start:dashboard
```

3. Wait until the terminal prints that the server is ready (Local: `http://localhost:4200`).
4. Open http://localhost:4200
5. You land on `/login`. Sign in with GitHub. After login you go to `/dashboard`.

Stop the server with `Ctrl+C`.

If port 4200 is already in use:

```bash
npm run start:dashboard -- --port 4202
```

Then open http://localhost:4202

If start says packages are missing, go back to **Step 2**.

---

### E. Run prebuilt images with Docker (no npm)

This starts published containers, not a live source server.

1. Install Docker Desktop and start it.
2. From the repo root:

```bash
cd snow-angular-ui
docker compose -f infra/docker-compose.yml up -d
```

3. Open the dashboard at http://localhost:4200

4. Stop:

```bash
docker compose -f infra/docker-compose.yml down
```

---

### If something fails

| What you see | What to do |
|---|---|
| `ERESOLVE could not resolve` | You omitted `--legacy-peer-deps`. Run `npm install --legacy-peer-deps`. |
| `Missing script: "start:dashboard"` | Run `npm run start:dashboard` (script is in `package.json`). |
| `Node packages may not be installed` | `node_modules` is missing. Do **Step 2**, then start again. Do not `ng serve` before install. |
| Port 4200 already in use | `npm run start:dashboard -- --port 4202` |
| `ng: command not found` | Do not use global `ng`. Use the npm scripts in this section. |
| GitHub login fails | Firebase + GitHub OAuth. See [FIREBASE_SETUP.md](projects/dashboard/FIREBASE_SETUP.md). |
| Dashboard API errors after login | Backend must be reachable. Default URL is `api.baseUrl` in `projects/dashboard/src/environments/environment.ts`. |

## 📁 Project Structure

```
snow-angular-ui/
├── projects/
│   ├── dashboard/              # Main dashboard application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── components/  # Reusable components
│   │   │   │   │   ├── card/    # Deployment card component
│   │   │   │   │   ├── card-list/# Card list container
│   │   │   │   │   ├── filters/ # Filter component
│   │   │   │   │   └── import-git-reporitories/ # Import GitHub repos and publish
│   │   │   │   ├── guards/      # Route guards
│   │   │   │   ├── interfaces/  # TypeScript interfaces
│   │   │   │   ├── mapper/      # Data mappers
│   │   │   │   ├── pages/       # Page components
│   │   │   │   ├── services/    # Business logic services
│   │   │   │   └── shared/      # Shared components
│   │   │   └── environments/    # Environment configuration
│   │   └── public/              # Static assets
├── angular.json                # Angular workspace configuration
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript configuration
```

## 🏗️ Architecture

### Component Architecture

- **Standalone Components**: All components are standalone (no NgModules)
- **Signal-based State**: Uses Angular Signals for reactive state management
- **Service Layer**: Business logic separated into injectable services
- **Route Guards**: Authentication protection for routes

### State Management

- **Signals**: Primary state management mechanism
- **Observables**: For async operations (HTTP, WebSocket)
- **Computed Signals**: Derived state from other signals

### Data Flow

```
User Action → Component → Service → API/WebSocket → Service → Component → UI Update
```

## 🔧 Services

### Core Services

#### `FirebaseAuth`
Handles Firebase authentication with GitHub OAuth.

**Key Methods:**
- `signInWithGitHub()`: Sign in with GitHub
- `signOut()`: Sign out current user
- `getGithubActorId(user)`: GitHub numeric user id
- `getGithubActor(user)`: GitHub username
- `getCurrentUserProfile()`: Get user profile data (includes `actorId`, `actor`, `gitType`)
- `getCurrentUser$()`: Observable of current user

**Signals:**
- `currentUser`: Current authenticated user
- `isAuthenticated`: Authentication status
- `isLoading`: Loading state
- `githubAccessToken`: GitHub OAuth access token

#### `HandleProfiles`
Manages user profile data and license information.

**Properties:**
- `profile`: User profile (getter/setter)
- `license`: License type (getter/setter)
- `pipelineSnowToken`: Pipeline token (getter/setter)
- `org`: Organization (getter/setter)

**Readonly Signals:**
- `profileSignal`: Reactive profile signal
- `licenseSignal`: Reactive license signal
- `pipelineSnowTokenSignal`: Reactive token signal
- `orgSignal`: Reactive org signal

**Methods:**
- `regenerateToken({ actorId, gitType })`: Regenerate pipeline token via API
- `reset()`: Reset all profile data

#### `HandleProfilesApi`
API service for profile-related operations.

**Methods:**
- `getProfile(email, { actorId?, actor?, gitType? })`: Get/create profile (camelCase body); response may include `gitType`
- `updateLicense(license, email)`: Update user license
- `getPipelineSnowToken({ actorId, gitType })`: Get pipeline token
- `regeneratePipelineSnowToken({ actorId, gitType })`: Regenerate token

#### `HandleDeploymentsRequest`
Manages deployment data and filtering.

**Signals:**
- `sourceDeployments`: Filtered deployments
- `allSourceDeploymentsSignal`: Unfiltered API cache
- `filters`: Current filter configuration
- `sourceDeploymentLoading`: Loading state

**Methods:**
- `loadSourceDeployments()`: Fetch via `GET /connectors/get-snow-deployments` (no query parameters)
**Methods:**
- `loadSourceDeployments()`: Load deployments from API
- `searchSourceDeployments(query)`: Search deployments by name
- `filterSourceDeploymentsByRepository(query)`: Filter cards by repository; persisted in `localStorage` (`snow.sources.repositoryFilter`)
- `currentRepositoryFilter()`: Read the current repository filter
- `setFilters(filters)`: Update filters
- `applyFilters(types)`: Apply filters and reload

#### `NotificationDeployment`
WebSocket service for real-time deployment updates.

**Signals:**
- `connectionState`: Current connection state
- `isConnected`: Connection status

**Methods:**
- `connect(url, autoReconnect)`: Connect to WebSocket
- `sendMessage(message)`: Send message
- `getMessages()`: Observable of messages
- `getErrors()`: Observable of errors
- `disconnect()`: Disconnect from WebSocket

**Features:**
- Automatic reconnection with exponential backoff
- Connection state tracking
- Error handling

### Route Guards

#### `authGuard`
Protects routes requiring authentication.

- Redirects unauthenticated users to login
- Preserves return URL for post-login redirect

## ⚙️ Configuration

### Environment Configuration

Edit `projects/dashboard/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  firebase: {
    // Firebase configuration
  },
  api: {
    baseUrl: 'http://localhost:8080',
    endpoints: {
      profile: '/connectors/profile',
      profileLicense: '/connectors/profile/license',
      profileToken: '/connectors/profile/snow-token-pipeline',
      snowDeployments: '/connectors/get-snow-deployments',
      tabs: '/connectors/tabs'
    }
  }
};
```

The running dashboard reads these paths from `config.ts`. `environment.ts` supplies `api.baseUrl` when Compose does not set `baseUrl`.

### API Endpoints

Snow backend request/response fields use **camelCase**. The host is `http://localhost:8080` and each path includes `/connectors`.

- **Profile**: `POST /connectors/profile` body `{ email, actorId?, actor?, gitType? }`; response `{ email, actor?, actorId?, gitType?, license?, org? }`
- **License**: `PUT /connectors/profile/license`
- **Pipeline Token**: `GET/PUT /connectors/profile/snow-token-pipeline`
- **Deployments**: `GET /connectors/get-snow-deployments` (no query parameters)

### Styling Configuration

- **Theme**: DaisyUI "dracula" theme (configurable in `styles.css`)
- **Typography**: Tailwind Typography plugin enabled
- **Colors**: All colors use DaisyUI theme variables

## 💻 Development

### Building the Project

```bash
npm run build:dashboard
npm run build:dashboard -- --configuration production
```

### Running Tests

```bash
npm test
npm run test:dashboard
```

### Code Quality

- **Linting**: ESLint (via Angular CLI)
- **Formatting**: Prettier configured
- **Type Safety**: Strict TypeScript mode

### Development Guidelines

1. **Use Signals** for reactive state management
2. **Standalone Components** - No NgModules
3. **Service Layer** - Business logic in services
4. **Type Safety** - Use interfaces for all data structures
5. **Error Handling** - Proper error handling in all API calls
6. **Documentation** - JSDoc comments for public methods

## 🐳 Deployment

### Docker

Use the per-app Dockerfiles. There is no root `Dockerfile`.

```bash
# Dashboard image (SSR Node on port 4000)
docker build -f Dockerfile.dashboard -t snow-ui-dashboard .
```

Or run the published compose file:

```bash
docker compose -f infra/docker-compose.yml up -d
```

### Production Build

```bash
npm run build:dashboard -- --configuration production
```

Output: `dist/dashboard/browser/` and `dist/dashboard/server/`. Run it with `node dist/dashboard/server/server.mjs`.

### API base URL

Set `baseUrl` on the `snow-dashboard-ui` service in `infra/docker-compose.yml`:

```yaml
    environment:
      baseUrl: http://localhost:8080
```

The dashboard Node server reads it on every request. `/settings-first-time-configs` is rendered on the server with it, and the server returns it at `GET /bootstrap-config.json`, which `main.ts` reads before the app starts. To change it, edit the value and run `docker compose -f infra/docker-compose.yml up -d`. The image is not rebuilt.

The browser calls this URL directly, so it must be reachable from the user's browser, not a Docker service name. When `baseUrl` is unset (for example under `ng serve`), the dashboard uses `api.baseUrl` from `projects/dashboard/src/environments/environment.ts`.

## 📚 Additional Documentation

### For AI agents

- **[AGENTS.md](AGENTS.md)** — Guidance for AI agents: project structure (dashboard vs docs), key paths, conventions, and commands. Cursor rules in `.cursor/rules/` reference this file.

### Core Documentation

- **[Services Documentation](docs/SERVICES.md)** - Detailed service API reference
- **[Components Documentation](docs/COMPONENTS.md)** - Component usage and patterns
- **[API Documentation](docs/API.md)** - Backend API endpoint reference
- **[API Authentication and Security](docs/API_AUTHENTICATION_SECURITY.md)** - Firebase Bearer auth, interceptor, backend verification
- **[Development Guide](docs/DEVELOPMENT.md)** - Development workflow and best practices
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System architecture and data flow
- **[Quick Reference](docs/QUICK_REFERENCE.md)** - Common code snippets and patterns

### Setup Guides

- [Firebase Setup Guide](projects/dashboard/FIREBASE_SETUP.md) - Firebase authentication setup

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass
4. Submit a pull request

## 📄 License

See individual license files in project directories.

## 🆘 Support

For issues and questions, please open an issue in the repository.
