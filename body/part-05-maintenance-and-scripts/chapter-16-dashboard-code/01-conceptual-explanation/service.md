# Service

The service layer is the classes under `projects/dashboard/src/app/services/`. [docs/SERVICES.md](../copies/org-snow-angular-ui/docs/SERVICES.md) is the list. They call the backend in [Backend](./backend.md). The `firebaseAuthInterceptor` adds the Firebase ID token to each `HttpClient` request whose URL starts with `environment.api.baseUrl`.

| Class | Path | What it does |
| --- | --- | --- |
| `FirebaseAuth` | `services/auth/firebase-auth.ts` | GitHub and Google sign-in, sign-out, `actorId`, ID token |
| `HandleProfiles` | `services/handlers/handle-profiles.ts` | Profile and license state. The navbar reads `license` |
| `HandleProfilesApi` | `services/actions-api/handle-profiles.api.ts` | `POST /profile`, license, pipeline token |
| `HandleTabs` | `services/handlers/handle-tabs.ts` | Tab list for the card list |
| `TabsActionsApi` | `services/actions-api/tabs-actions.api.ts` | `GET`/`POST /tabs`, `PUT`/`DELETE /tabs/{tabId}` |
| `HandleDeploymentsRequest` | `services/handlers/handle-deployments-request.api.ts` | `loadSourceDeployments()` and `loadPersistentDeployments()` |
| `DeploymentsActionsApi` | `services/actions-api/deployments-actions.api.ts` | Sources list, history list, color, delete, liveness |
| `GithubActionsApi` | `services/actions-api/github-actions.api.ts` | GitHub REST for the import component. That screen is not routed |
| `NotificationDeployment` | `services/notifications/notification-deployment.websocket.ts` | WebSocket connect, reconnect, messages |

`DeploymentsActionsApi.fetchSnowDeployments` calls `/get-snow-deployments` with `actorId`, `gitType`, and `type`. `fetchPersistentSnowDeployments` calls `/get-snow-deployments-persistent` with no query. History uses that second call.

The process those classes reach is the Spring Boot service. [org-snow-publish-java/docs/user-guide.md](../copies/org-snow-publish-java/docs/user-guide.md) is the run and API reference. `GET /health` returns `Healthy`. The compose file publishes that process on port `8080`.
