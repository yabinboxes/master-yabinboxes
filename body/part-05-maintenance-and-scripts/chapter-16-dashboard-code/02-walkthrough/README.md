# 2. Walkthrough

The files below are copies stored in this chapter.

## UI — org-snow-angular-ui

| Doc | What it records |
| --- | --- |
| [README.md](../copies/org-snow-angular-ui/README.md) | Workspace, stack, how to run dashboard, docs, and snow-filters |
| [CLAUDE.md](../copies/org-snow-angular-ui/CLAUDE.md) | Commands, routes, service names, API base URL |
| [AGENTS.md](../copies/org-snow-angular-ui/AGENTS.md) | Paths and the route map |
| [projects/dashboard/README.md](../copies/org-snow-angular-ui/projects/dashboard/README.md) | Dashboard routes and `environment.ts` endpoints |
| [docs/ARCHITECTURE.md](../copies/org-snow-angular-ui/docs/ARCHITECTURE.md) | Shell, child routes, deployment load order |
| [projects/docs/README.md](../copies/org-snow-angular-ui/projects/docs/README.md) | Docs site |
| [app.routes.ts](../copies/org-snow-angular-ui/projects/dashboard/src/app/app.routes.ts) | The route table the docs describe |

## Backend — org-snow-publish-java

| Doc | What it records |
| --- | --- |
| [docs/README.md](../copies/org-snow-publish-java/docs/README.md) | Index of the backend docs |
| [docs/user-guide.md](../copies/org-snow-publish-java/docs/user-guide.md) | Run steps and the endpoint tables, including tabs, persistent deployments, and health |
| [docs/business-logic.md](../copies/org-snow-publish-java/docs/business-logic.md) | Queue, the 1 second and 2 second tasks, tables |
| [docs/api-authentication-and-security.md](../copies/org-snow-publish-java/docs/api-authentication-and-security.md) | Pipeline token versus Firebase Bearer |
| [infra/docker-compose.yml](../copies/org-snow-publish-java/infra/docker-compose.yml) | Image `yabinm/snow-publish-java:latest`, port `8080` |

## Service — dashboard `app/services`

| Doc | Code |
| --- | --- |
| [docs/SERVICES.md](../copies/org-snow-angular-ui/docs/SERVICES.md) | Service list |
| [docs/API.md](../copies/org-snow-angular-ui/docs/API.md) | Endpoints the UI calls, including `/tabs` and `/get-snow-deployments-persistent` |
| [environment.ts](../copies/org-snow-angular-ui/projects/dashboard/src/environments/environment.ts) | `baseUrl` and endpoint keys |
| [deployments-actions.api.ts](../copies/org-snow-angular-ui/projects/dashboard/src/app/services/actions-api/deployments-actions.api.ts) | Sources and history HTTP |
| [tabs-actions.api.ts](../copies/org-snow-angular-ui/projects/dashboard/src/app/services/actions-api/tabs-actions.api.ts) | Tab HTTP |
| [handle-profiles.api.ts](../copies/org-snow-angular-ui/projects/dashboard/src/app/services/actions-api/handle-profiles.api.ts) | Profile HTTP |
