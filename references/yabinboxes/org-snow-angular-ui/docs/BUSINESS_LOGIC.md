# Business Logic

**Project:** Snow Angular UI (`snow-angular-ui`)

This document covers the application's business rules, decision logic, and end-to-end workflows. For service APIs see `SERVICES.md`; for data models see `COMPONENTS.md`; for HTTP endpoints see `API.md`.

---

## Core Business Rules

### License-gated Features

The user's license type (`LicenseType`: `'self' | 'individual' | 'business' | 'empty'`) gates certain UI features:

| License | Reports tab visible | Notes |
|---|---|---|
| `self` | No | Hides route entry point in navbar |
| `individual` | Yes | |
| `business` | Yes | |
| `empty` | Yes | Default until profile is fetched |

The route `/dashboard/reports` still exists and is auth-guarded — the license check only removes the navigation entry point. If a user navigates directly to the URL, they can access it.

### Dashboard Readiness Gate

The sources page **must not render** until:
1. The user profile has been fetched from the API (provides `license`, `org`, and optional `gitType`)
2. The tabs list has loaded when tabs are enabled (provides the tab structure for `card-list`)

`DashboardComponent` exposes a `profileAndTabsReady` computed signal that gates child rendering. This prevents a flash of empty state or incorrect tab count.

### Empty Deployments State

After `HandleDeploymentsRequest` finishes loading and the unfiltered deployment list is empty, the sources page shows an empty state in `#card-details-container` with a link to the docs (`https://docs.snow-monkeys.com/docs/home`) instead of redirecting to import.

### Tab Deletion Guard

A tab can only be deleted when:
- It is not the default tab (`tabId !== 0` or `tabId !== 'default'`)
- At least 2 tabs exist (so there is always at least one remaining after deletion)

`card-list` enforces this with `canRemoveTab(id)`.

### Minimum Tab Count

The default tab (id: `default`, name: `Dashboard`) always exists and cannot be removed. It is the anchor for the router outlet. Custom tabs added via the API appear alongside it.

---

## Authentication Flow

```
/login
  ↓ user clicks "Continue with GitHub"
FirebaseAuth.signInWithGitHub()
  ↓ GitHub OAuth popup
  ↓ captures GitHub access token (stored as githubAccessToken signal)
Firebase SDK returns authenticated User
  ↓ resolves actorId (GitHub numeric id) and actor (GitHub username)
  ↓ sets HandleProfiles.profile including actorId, actor, gitType ('github' default)
  ↓ POST /profile with { email, actorId, actor, gitType } (non-blocking)
authGuard allows navigation to /dashboard
  ↓
DashboardComponent.ngOnInit() → validateAuth()
  ↓ checks isAuthenticated() (waits if isLoading)
  ↓ sets profile from FirebaseAuth.getCurrentUserProfile() (includes actorId, actor, gitType)
  ↓ sets profileEmail signal → triggers profileQuery
profileQuery → POST /profile with { email, actorId, actor, gitType }
  ↓ response: { email, license, org, gitType }
  ↓ HandleProfiles.license = license
  ↓ HandleProfiles.org = org
  ↓ HandleProfiles.profile.gitType = gitType (from API when present)
profileAndTabsReady becomes true → sources renders
```

**Key constraint**: The Firebase `onAuthStateChanged` listener runs asynchronously. The guard polls `isLoading` before evaluating `isAuthenticated` to avoid redirecting a loading user to `/login`.

---

## Deployment Loading Flow

```
Sources page initializes
  ↓ effect: waits for FirebaseAuth.isLoading() === false
HandleDeploymentsRequest.loadSourceDeployments()
  ↓ reads GitHub actorId via FirebaseAuth.getGithubActorId(currentUser)
  ↓ reads gitType from HandleProfiles.profile (default 'github')
  ↓ sets actorId + gitType signals → triggers deploymentsQuery
deploymentsQuery → GET /get-snow-deployments?actorId={actorId}&gitType={gitType}&type=ALL
  ↓ API returns APISnowDeploymentResponse[]
SourceDeploymentMapper transforms response → SourceDeployment[]
  ↓ stored in allSourceDeployments (unfiltered cache)
Effect derives sourceDeployments:
  ↓ applies TypesForm filters (source type, provider, color)
  ↓ applies search query (name substring match)
  ↓ result written to sourceDeployments signal
If allSourceDeployments is empty → show docs empty state in card-details-container
Otherwise card-list renders filtered deployments
```

**Filter short-circuit**: If all checkboxes in a category are `true`, that category is skipped (show all). Only categories with at least one `false` value are applied as filters.

---

## Real-time Update Flow

```
NotificationDeployment.connect(wsUrl, autoReconnect: true)
  ↓ WebSocket opens
  ↓ sets connectionState = CONNECTED
Server pushes JSON: { data: SourceDeployment[] }
  ↓ getMessages() Observable emits raw string
HandleDeploymentsRequest.setSourceDeployments(parsed.data)
  ↓ overwrites allSourceDeployments
  ↓ filter/search effect re-derives sourceDeployments
card-list re-renders automatically
```

**Reconnection**: On unexpected close, `scheduleReconnect()` uses exponential backoff starting at 1 s, doubling each attempt, capped at 30 s. After 5 failed attempts it stops.

---

## Color Tagging Flow

```
User clicks a color swatch on a card
selectColor(color, event)
  ↓ updates selectedColor signal locally (optimistic UI)
updateColorMutation.mutate({ sourceId, color })
  ↓ PUT /publish-snow-deployment/color/{sourceId}?color={color}
  ↓ on success: logs confirmation
  ↓ on failure: mutation error (no rollback implemented)
```

Color is stored per deployment on the backend and returned in the deployment list on next fetch or WebSocket push.

---

## Liveness Type Update Flow

```
User opens liveness dropdown on a card
selectLivenessType(type, event)
  ↓ updates liveness signal locally
updateLivenessMutation.mutate({ snowDeploymentId, livenessType })
  ↓ PUT /publish-snow-deployment/liveness-type/{snowDeploymentId}
  ↓ on success: logs confirmation
```

**Valid liveness types**: `'deployable' | 'not-deployable' | 'unknown'`
**Valid liveness statuses** (read-only on card): `'active' | 'inactive' | 'not-deployable' | 'unknown'`

---

## GitHub Repository Import Flow

**Deprecated.** This screen is not routed.

```
User navigates to /dashboard/import
  ↓ ImportGitReporitoies component initializes
  ↓ pre-selects first available tab from HandleTabs

User enters GitHub token → clicks "Load Repos"
loadRepos()
  ↓ validates registry field is not empty
  ↓ calls GithubActionsApi.fetchRepos({ token, ... })
    ↓ GET https://api.github.com/user/repos (user repos)
    ↓ GET https://api.github.com/user/orgs → each org repos
    ↓ GET enterprise repos (if enterprise configured)
    ↓ deduplicates by repo ID
  ↓ sets repos signal
  ↓ sets initial snow types:
      repo.language === 'HCL'  →  'APPLICATION'
      all others               →  'SERVICE'

User selects repos, adjusts snow types, clicks "Publish"
publishSelectedRepos()
  ↓ for each selected repo:
      buildPublishPayload(repo, identity) → PublishSnowDeploymentPayload
      HandleDeploymentsRequest.publishSnowDeployment(payload)
        ↓ POST /publish-snow-deployment
  ↓ all mutations fire in parallel
  ↓ isPublishing = true → shows "Publishing..."
  ↓ isRedirecting = true → shows "Redirecting to dashboard..."
  ↓ after 2.5 s → router.navigate(['/dashboard'])
```

**HCL → APPLICATION rule**: Terraform/OpenTofu repos (language: `HCL`) represent infrastructure-as-code and are classified as `APPLICATION` type. All other repos default to `SERVICE`.

---

## License Management Flow

```
Settings page loads
  ↓ reads HandleProfiles.license (signal)
  ↓ stores originalLicense for change detection

User changes license dropdown
updateLicense(newLicense)
  ↓ updates local UI signal only (no API call yet)
  ↓ hasLicenseChanged computed: newLicense !== originalLicense
  ↓ shows "Save" button

User clicks "Save"
saveLicenseToApi()
  ↓ isUpdatingLicense = true
  ↓ PUT /profile/license with { email, license }
  ↓ on success:
      HandleProfiles.license = newLicense
      originalLicense = newLicense
      licenseUpdateSuccess = true
  ↓ on failure: licenseUpdateError = error message
```

---

## Pipeline Token Flow

### View Token

```
Settings page
  ↓ user clicks "Show Token" / "Copy"
  ↓ if pipelineSnowToken already loaded: use local token
  ↓ else: isFetchingToken = true
      GET /profile/snow-token-pipeline?actorId={actorId}&gitType={gitType}
      HandleProfiles.pipelineSnowToken = response.token
      reveal / copy in UI
```

### Copy Token

```
copyToken()
  ↓ fetches token if not loaded (same as view flow; requires actorId + gitType)
  ↓ navigator.clipboard.writeText(token)
  ↓ copySuccess = true → shows "Copied!" feedback
```

### Regenerate Token

```
regenerateToken()
  ↓ isRegeneratingToken = true
HandleProfiles.regenerateToken({ actorId, gitType })
  ↓ PUT /profile/snow-token-pipeline?actorId={actorId}&gitType={gitType}
  ↓ updates pipelineSnowToken signal
  ↓ tokenRegenerateSuccess = true
```

---

## Tab Management Flow

### Add Tab
```
User clicks "+" in card-list header
addTab()
  ↓ HandleTabs.addTab(name)
    ↓ POST /tabs with { tabName }
    ↓ refetches tabs query
  ↓ new tab appears, card-list activeTabId stays current
```

### Edit Tab Name
```
User clicks pencil icon on tab
startEditTab(tab)
  ↓ editingTabId = tab.tabId, editingTabName = tab.tabName
User types, presses Enter or clicks save
saveEditTab()
  ↓ HandleTabs.updateTab(tabId, tabName)
    ↓ PUT /tabs/{tabId}
    ↓ refetches tabs query
  ↓ editingTabId = null (exits edit mode)
```

### Delete Tab
```
User clicks trash icon
  ↓ canRemoveTab(id) check (must not be default, at least 2 tabs)
  ↓ isDeleteDialogOpen = true (confirmation modal)
User confirms
proceedDeleteTab()
  ↓ HandleTabs.removeTab(tabId)
    ↓ DELETE /tabs/{tabId}
    ↓ refetches tabs query
  ↓ if deleted tab was active: activeTabId resets to first tab
```

### Tab Filtering of Deployments
`card-list` filters `deployments` input by `activeTabId`. Each `SourceDeployment` has a `tabId` field set at publish time. Switching tabs shows only deployments published under that tab.

---

## Snow Type Mapping

| Repo Language | Default Snow Type | Rationale |
|---|---|---|
| `HCL` | `APPLICATION` | Terraform repos define deployable infrastructure apps |
| anything else | `SERVICE` | Generic backend/frontend services |

Users can override the auto-assigned type per repo in the import UI.

---

## Data Model Relationships

```
UserProfile (Firebase + GitHub identity)
  ├── email
  ├── actorId  (GitHub numeric id)
  ├── actor    (GitHub username)
  └── gitType  (default 'github'; updated from profile API response when present)
         │
         ├──────────────────────────────┐
         ↓                              ↓
POST /profile { email, actorId, actor, gitType }
GET /get-snow-deployments?actorId=&gitType=&type=ALL
         ↓
APIProfileResponse
  ├── license  → LicenseType
  ├── org      → string
  └── gitType  → string (applied onto UserProfile)

SourceDeployment
  ├── tabId    → which tab it belongs to
  ├── color    → CardColor (user-assigned tag)
  ├── sourceType → SourceType (application | service | cluster)
  ├── providers  → ProviderType[]
  └── livenessType / livenessStatus → health state

TabsApiTab
  └── tabId / tabName → drives tab bar + deployment filtering
```

---

## Error States

| Scenario | Behavior |
|---|---|
| Profile API fails | Error logged to console; license stays `'empty'` |
| Deployments fetch fails | Error logged; `sourceDeployments` stays empty |
| Empty deployments after load | Sources `#card-details-container` shows docs link (`https://docs.snow-monkeys.com/docs/home`) |
| Empty tabs after load | `card-list` shows an error state component |
| WebSocket max reconnects | Stops attempting; `connectionState = ERROR` |
| Publish mutation fails | TanStack Query mutation error; UI shows no specific feedback currently |
| License save fails | `licenseUpdateError` signal shown in settings UI |
| Token regenerate fails | `tokenRegenerateError` signal shown in settings UI |
