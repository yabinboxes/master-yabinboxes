# Backend

The backend is [org-snow-publish-java](../../../../../org-snow-publish-java/docs/README.md). `pom.xml` sets Java 21. The parent is Spring Boot 3.4.5. The package is `com.snow`. PostgreSQL schema is `connectors`.

[docs/business-logic.md](../../../../../org-snow-publish-java/docs/business-logic.md) describes the pipeline:

1. `POST /connectors/publish-snow-deployment` puts the event on `SingletonQueue` and returns `201`.
2. `ScheduledCommandTasks` runs every 1 second and writes the queue into `data_source_snow_deployments_persistent` and `data_source_snow_deployments_volatile`.
3. `ScheduledProcessTasks` runs every 2 seconds, finds `profile_owners` by `actorId` and `gitType`, and upserts `snow_deployments_{profile_id}`.

The profile table is what `GET /connectors/get-snow-deployments` reads. `GET /connectors/get-snow-deployments/all` reads `snow_deployments_anonymous`. The pipeline does not insert into that anonymous table.

## Auth

From [api-authentication-and-security.md](../../../../../org-snow-publish-java/docs/api-authentication-and-security.md):

| Call | Bearer |
| --- | --- |
| `POST /connectors/publish-snow-deployment` | `snowTokenPipeline` |
| `GET /connectors/get-snow-url` | `snowTokenPipeline` |
| Other `/connectors/**` | Firebase ID token |

`snow.auth.token-validation-enabled` defaults to `true`. `/health` and `/liveness-test` are outside `/connectors/**`.

## Endpoints the dashboard uses

The path list is [docs/user-guide.md](../../../../../org-snow-publish-java/docs/user-guide.md). The dashboard `environment.ts` names six of them under `api.baseUrl`:

| `environment.api.endpoints` | Method and path |
| --- | --- |
| `profile` | `POST /connectors/profile`, `PUT /connectors/profile` |
| `profileLicense` | `PUT /connectors/profile/license` |
| `profileToken` | `GET` and `PUT /connectors/profile/snow-token-pipeline` |
| `snowDeployments` | `GET /connectors/get-snow-deployments` |
| `snowDeploymentsPersistent` | `GET /connectors/get-snow-deployments-persistent` |
| `tabs` | `GET`, `POST /connectors/tabs`, `PUT` and `DELETE /connectors/tabs/{tabId}` |

Color, delete, and liveness updates go to `/connectors/publish-snow-deployment/...`. Those paths are in the same user guide and in [docs/API.md](../../../../../org-snow-angular-ui/docs/API.md) on the UI side.

`infra/docker-compose.yml` runs image `yabinm/snow-publish-java:latest` and publishes port `8080`. It sets `POSTGRES_DB_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `FIREBASE_ADMINSDK`.
