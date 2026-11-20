# Architecture Overview

**Project:** Snow Angular UI (`snow-angular-ui`)

This document provides an architectural overview of the Snow Angular UI application.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Angular Application                      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Pages      │  │  Components   │  │   Services    │     │
│  │              │  │               │  │               │     │
│  │ - Dashboard  │  │ - Card        │  │ - FirebaseAuth │     │
│  │ - Sources    │  │ - CardList    │  │ - HandleProfiles│   │
│  │ - History    │  │ - Filters     │  │ - HandleTabs   │     │
│  │ - Settings   │  │ - Navbar      │  │ - Deployments │     │
│  │ - Login      │  │               │  │ - WebSocket   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Firebase   │    │  Backend API  │    │  WebSocket    │
│  Auth Service│    │  (REST)       │    │  Server       │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Component Hierarchy

```
AppComponent
└── RouterOutlet
    ├── DashboardComponent
    │   ├── NavbarComponent
    │   ├── Dynamic Tabs (default tab = router content; add/remove tabs)
    │   └── RouterOutlet (child routes, shown in default tab only)
    │       ├── SourcesComponent
    │       │   └── CardListComponent
    │       │       └── CardComponent (multiple)
    │       ├── SourcesHistoryComponent
    │       ├── SettingsComponent
    │       ├── ReportsComponent
    │       ├── EasyDeploymentComponent
    │       ├── SelfLicenseComponent
    │       └── IndividualLicenseComponent
    ├── LoginComponent
    └── NotFoundComponent
```

`import` is still a folder under `pages/dashboard/import/` and is commented out in `app.routes.ts`. The navbar History link goes to `/dashboard/history`. Easy deployment and Reports appear in the navbar when `HandleProfiles.license` is `individual` or `business`.

## Data Flow

### Deployment Loading Flow

```
Component initializes
    ↓
HandleDeploymentsRequest.loadSourceDeployments()
    ↓
Get GitHub actorId from FirebaseAuth.getGithubActorId()
    ↓
HTTP GET {baseUrl}/get-snow-deployments?actorId={actorId}&gitType={gitType}&type=ALL
    ↓
Map API response to SourceDeployment[]
    ↓
Apply filters
    ↓
Update sourceDeployments signal
    ↓
Component displays deployments (or empty-state docs link if none)
```

### Authentication Flow

```
User clicks "Continue with GitHub"
    ↓
FirebaseAuth.signInWithGitHub()
    ↓
Firebase Authentication
    ↓
User authenticated; resolve actorId + actor; default gitType 'github'
    ↓
POST /profile with { email, actorId, actor, gitType }
    ↓
Set profile in HandleProfiles service
    ↓
Update license, org, and gitType from API response
    ↓
Navigate to dashboard
```

### Real-time Updates Flow

```
WebSocket connects
    ↓
NotificationDeployment.connect(url)
    ↓
Server sends deployment updates
    ↓
NotificationDeployment.getMessages()
    ↓
Parse JSON message
    ↓
HandleDeploymentsRequest.setSourceDeployments()
    ↓
Apply filters
    ↓
Update sourceDeployments signal
    ↓
UI automatically updates (reactive)
```

## State Management

### Signal-based Architecture

```
┌─────────────────────────────────────────┐
│         Service Layer (Signals)         │
│                                          │
│  FirebaseAuth                            │
│  ├── currentUser: Signal<User>          │
│  ├── isAuthenticated: Signal<boolean>   │
│  └── isLoading: Signal<boolean>         │
│                                          │
│  HandleProfiles                          │
│  ├── profileSignal: Signal<UserProfile> │
│  ├── licenseSignal: Signal<LicenseType>│
│  └── pipelineSnowTokenSignal: Signal   │
│                                          │
│  HandleDeploymentsRequest                │
│  ├── sourceDeployments: Signal<[]>      │
│  ├── filters: Signal<TypesForm>          │
│  └── sourceDeploymentLoading: Signal    │
└─────────────────────────────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────┐  ┌─────────────────┐
│   Components     │  │   Components    │
│   (Read signals) │  │   (Read signals)│
└─────────────────┘  └─────────────────┘
```

### Reactive Updates

Components automatically update when signals change:

```typescript
// Component reads signal
readonly deployments = this.deploymentsService.sourceDeployments;

// Template uses signal
@for (deployment of deployments(); track deployment.sourceId) {
  <app-card [itemCard]="deployment"></app-card>
}

// When signal updates, template automatically re-renders
```

## Service Dependencies

```
FirebaseAuth
    │
    ├──→ HandleProfiles (uses currentUser)
    │
    └──→ HandleDeploymentsRequest (uses currentUser email)

HandleProfiles
    │
    └──→ HandleProfilesApi (for API calls)

HandleDeploymentsRequest
    │
    ├──→ FirebaseAuth (for user email)
    │
    └──→ SourceDeploymentMapper (for data mapping)

NotificationDeployment
    │
    └──→ (standalone, no dependencies)
```

## Routing Structure

```
/ (root)
├── /login (public)
├── / (protected, requires auth)
│   ├── / (default: sources)
│   ├── /easy-deployment
│   ├── /reports (hidden if license === 'self')
│   └── /settings
├── /self-license (protected)
├── /individual-license (protected)
└── /** (404 page)
```

## Security

### Authentication

- **Route Guards**: `authGuard` protects routes
- **Firebase Auth**: Handles OAuth with GitHub
- **Token Management**: Pipeline tokens stored in service

### Data Protection

- **Email Validation**: Required for API calls
- **Error Handling**: Proper error messages without exposing internals
- **CORS**: Backend must allow frontend origin

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**: Routes are lazy-loaded
2. **OnPush Change Detection**: Can be used for better performance
3. **Signal Efficiency**: Signals only update when values change
4. **WebSocket**: Real-time updates without polling

### Bundle Size

- **Tree Shaking**: Unused code is eliminated
- **Code Splitting**: Routes are code-split
- **Library Optimization**: Only import what's needed

## Testing Strategy

### Unit Tests

- **Services**: Test business logic
- **Components**: Test component behavior
- **Guards**: Test route protection

### Integration Tests

- **API Integration**: Mock HTTP calls
- **Authentication Flow**: Test sign-in/sign-out
- **Component Interaction**: Test parent-child communication

## Deployment Architecture

### Development

```
Angular Dev Server (port 4200)
    ↓
Backend API (port 8080)
    ↓
Firebase Auth
```

### Production

```
Nginx (serves static files)
    ↓
Backend API
    ↓
Firebase Auth
```

### Docker

```
Docker Container
├── Nginx (serves built Angular app)
└── Static files from build stage
```

## Future Considerations

### Potential Improvements

1. **State Management**: Consider NgRx if state becomes complex
2. **Caching**: Implement HTTP caching for API calls
3. **Offline Support**: Service workers for offline functionality
4. **Internationalization**: i18n support for multiple languages
5. **Testing**: Increase test coverage
6. **Performance**: Implement virtual scrolling for large lists
