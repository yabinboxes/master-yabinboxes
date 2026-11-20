# Components Documentation

**Project:** Snow Angular UI (`snow-angular-ui`)

This document provides detailed documentation for key components in the Snow Angular UI project.

## Table of Contents

- [Card Component](#card-component)
- [Card List Component](#card-list-component)
- [Filters Component](#filters-component)
- [Import Git Repositories Component](#import-git-repositories-component)
- [Navbar Component](#navbar-component)
- [Page Components](#page-components)

---

## Card Component

**Location**: `projects/dashboard/src/app/components/card/`

Displays individual deployment cards with color tagging, provider icons, and detailed information.

### Features

- **Color Tagging**: Color picker lives on the sources details panel
- **Provider Icons**: Displays provider-specific icons (AWS, Azure, DigitalOcean, etc.)
- **Liveness Icons**: CircleCheck (`text-sky-400`) for `active`; no icon for `not-deployable`; CircleAlert for unknown/inactive
- **Modal Details**: Click card to view full deployment details
- **Remove**: Hover X calls `DELETE /publish-snow-deployment` with the Firebase Bearer token, then drops the card from the list
- **Date Formatting**: Short date format (MM/DD/YYYY)

### Inputs

```typescript
itemCard: Signal<SourceDeployment>  // Deployment data
modalId: Signal<number>
titleClick: Output<SourceDeployment>
removed: Output<SourceDeployment>
```

### Methods

#### `selectColor(color: CardColor, event: Event): void`

Updates the deployment color via API.

**Parameters:**
- `color`: Color to set ('blue' | 'green' | 'red' | 'yellow' | 'orange' | '')
- `event`: Click event

**API Call**: `PUT /publish-snow-deployment/color/{sourceId}?color={color}`

#### `toggleColorPalette(event: Event): void`

Toggles the color palette visibility.

#### `formatShortDate(dateString: string): string`

Formats date to MM/DD/YYYY format.

### Color Options

- Blue
- Green
- Red
- Yellow
- Orange
- No Color (empty string)

---

## Card List Component

**Location**: `projects/dashboard/src/app/components/card-list/`

Container component that displays a list of deployment cards.

### Inputs

```typescript
items: Signal<SourceDeployment[]>  // Array of deployments
```

---

## Filters Component

**Location**: `projects/dashboard/src/app/components/filters/`

Filter component for deployments with multiple filter categories.

### Filter Categories

1. **Source Types**
   - Applications
   - Services
   - Clusters

2. **Providers**
   - AWS
   - Azure
   - DigitalOcean
   - Cloudflare
   - Civo

3. **Colors**
   - Blue
   - Green
   - Red
   - Yellow
   - Orange
   - No Color

### Methods

#### `onFilterChange(): void`

Called when any filter changes. Updates the deployment service filters.

### Form Structure

Uses Angular Reactive Forms with `FormBuilder`:

```typescript
typesForm: FormGroup<{
  applications: FormControl<boolean>;
  services: FormControl<boolean>;
  cluster: FormControl<boolean>;
  // ... provider and color controls
}>
```

---

## Import Git Repositories Component

**Deprecated.** This screen is not routed.

**Location**: `projects/dashboard/src/app/components/import-git-reporitories/`

Import GitHub repositories and publish them as Snow deployments (Application, Service, or Cluster).

### Features

- **Fetch Repositories**: Token + provider (GitHub only); lists repos via GitHub API with TanStack Query caching
- **Select Repos**: Checkboxes per repo, “select all” toggle
- **Snow Type per Repo**: Dropdown per repo (Application, Service, Cluster). After fetch, default is derived from repo language:
  - **HCL** → Application
  - **Any other or missing language** → Service
- **Publish**: Calls publish API for each selected repo; shows “Publishing...” on button, then loading-dots “Redirecting to dashboard...” and redirects to dashboard after a short delay

### Signals

- `repos`: Fetched GitHub repos
- `selectedRepoIds`: Set of selected repo IDs
- `selectedSnowTypes`: Map of repo id → 'APPLICATION' | 'SERVICE' | 'CLUSTER'
- `isLoading`, `isPublishing`, `isRedirecting`: Loading and transition states
- `errorMessage`: Error message to display
- `hasImported`: Whether fetch has been run at least once

### Methods

- `loadRepos()`: Fetches repos, then sets initial snow types from language (HCL → APPLICATION, else SERVICE)
- `toggleAll(checked)`, `toggleRepo(repoId, checked)`: Selection
- `setSnowType(repoId, value)`, `getSnowType(repoId)`: Snow type per repo
- `publishSelectedRepos()`: Publishes selected repos, shows redirect transition, then navigates to dashboard

---

## Navbar Component

**Location**: `projects/dashboard/src/app/shared/navbar/`

Top navigation bar with user profile and menu items.

### Features

- **User Avatar**: Displays user profile picture
- **User Name**: Shows authenticated user's display name
- **Home Icon**: Lucide Angular home icon with label
- **Docs**: Opens [https://docs.snow-monkeys.com/](https://docs.snow-monkeys.com/) in a new tab
- **Conditional Menu Items**: Hides "Reports" for 'self' license
- **Logout**: Sign out functionality

### Conditional Display

- **Reports Menu**: Hidden if `license === 'self'`
- **User Info**: Only shown when authenticated

### Methods

#### `logout(): void`

Signs out the current user via FirebaseAuth service.

---

## Page Components

### Dashboard

**Location**: `projects/dashboard/src/app/pages/dashboard/`

Main dashboard container with **dynamic tabs**, router outlet, and navigation.

**Features:**
- **Dynamic tabs**: Each tab has an `id` and `name`. Default tab (id `'default'`, name `'Dashboard'`) shows the main router outlet (sources, import, settings, etc.). Additional tabs can be added via “Add tab” and removed (except the default); extra tabs show placeholder content.
- **Tab API**: `setActiveTab(id)`, `addTab()`, `removeTab(id)`, `canRemoveTab(id)` (default tab cannot be removed; at least one tab required).
- Validates authentication on init
- Loads user profile and license from API
- Sets up profile service with user data

### Sources

**Location**: `projects/dashboard/src/app/pages/dashboard/sources/`

Displays deployment list with search functionality.

**Features:**
- Real-time WebSocket updates
- Search by deployment name
- Filter integration
- Loading states
- Empty state in `#card-details-container` linking to docs when `get-snow-deployments` returns no items

### Settings

**Location**: `projects/dashboard/src/app/pages/dashboard/settings/`

User settings page with profile, token, and license management.

**Sections:**
1. **Profile Information**: Display name, email, provider
2. **Pipeline Snow Token**: View, copy, regenerate token
3. **License Type**: View and change license type

**Features:**
- Token copying to clipboard
- License API integration
- Real-time validation
- Success/error notifications

### Login

**Location**: `projects/dashboard/src/app/pages/login/`

Centered authentication card with GitHub OAuth.

**Features:**
- GitHub sign-in button
- Resolves GitHub `actorId` / `actor`, defaults `gitType` to `"github"`, and POSTs `/profile` with camelCase body
- Applies profile API `gitType` onto `HandleProfiles.profile` when returned
- Return URL handling
- Error messages
- Loading states
- Docs link to `https://docs.snow-monkeys.com/docs/home` (opens in a new tab)

### Self License / Individual License

**Location**: `projects/dashboard/src/app/pages/self-license/` and `individual-license/`

License terms pages rendered from markdown.

**Features:**
- Markdown rendering with ngx-markdown
- Tailwind Typography styling
- Date display in footer

---

## Component Patterns

### Standalone Components

All components are standalone (no NgModules):

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ...],
  templateUrl: './example.html'
})
```

### Signal-based State

Components use signals for reactive state:

```typescript
private data = signal<DataType>(initialValue);
readonly dataSignal = this.data.asReadonly();
```

### Dependency Injection

Use `inject()` function:

```typescript
private service = inject(ServiceName);
```

### Error Handling

Always handle errors in API calls:

```typescript
this.service.method().subscribe({
  next: (data) => { /* success */ },
  error: (error) => { /* handle error */ }
});
```
