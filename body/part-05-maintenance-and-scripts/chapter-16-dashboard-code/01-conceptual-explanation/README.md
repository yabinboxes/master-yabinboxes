# 1. Conceptual explanation

Dashboard code is three parts. The UI is the Angular workspace. The backend is the Spring Boot service that stores deployments. The service layer is the set of Angular classes that call that backend, plus the publish process those classes call.

| Part | Repository | Entry |
| --- | --- | --- |
| UI | [org-snow-angular-ui](../copies/org-snow-angular-ui/README.md) | [Ui](./ui.md) |
| Backend | [org-snow-publish-java](../copies/org-snow-publish-java/docs/README.md) | [Backend](./backend.md) |
| Service | [docs/SERVICES.md](../copies/org-snow-angular-ui/docs/SERVICES.md) | [Service](./service.md) |

`environment.ts` sets `api.baseUrl` to `https://api.snow-monkeys.com/connectors`. Every connectors call from the dashboard sends `Authorization: Bearer` with a Firebase ID token, except the publish POST and `GET /connectors/get-snow-url`, which the backend accepts with the pipeline token. That split is in [api-authentication-and-security.md](../copies/org-snow-publish-java/docs/api-authentication-and-security.md).
