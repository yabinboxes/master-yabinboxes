# Tech debt: config.ts API base URL

The dashboard used to take `api.baseUrl` from an environment variable compiled into `config.ts`. That wiring is removed. This note records how it worked and why it should not be put back.

## What it did

`config.ts` exported `dashboardConfig`. `api.baseUrl` came from `apiBaseUrlFromEnvironment()`:

- It read `process.env.baseUrl`.
- A non-empty string became `api.baseUrl`.
- Anything else fell back to `https://api.snow-monkeys.com/connectors`.

`projects/dashboard/src/main.ts` calls `loadRuntimeConfig()` before bootstrap. That function clones `dashboardConfig`, then lets a value saved in this browser (`snow.config.baseUrl`) replace `api.baseUrl`. GitLab, GitHub, and the endpoint paths stay in `config.ts`.

## How the Docker build inlined the value

The browser cannot see a container environment variable after the JavaScript is built. `Dockerfile.dashboard` therefore copied the value in at image build time:

- `ARG baseUrl` defaulted to `https://api.snow-monkeys.com/connectors`.
- `ENV baseUrl=$baseUrl` exposed it to the build.
- `ng build dashboard --configuration production --define process.env.baseUrl=\"${baseUrl}\"` replaced `process.env.baseUrl` in `config.ts` with that string.

`infra/docker-compose.yml` repeated `http://localhost:8080/connectors` in two places:

- `build.args.baseUrl`, which is what a local image build compiled into `config.ts`.
- `environment.baseUrl`, which set the same variable on the running container.

The container variable was not read again after the image was built. `pull_policy: always` uses the published image `yabinm/snow-ui-dashboard-selfhosted:latest`, so a compose-only change did not change `api.baseUrl` inside that image.

## Why this is debt

- `projects/dashboard/src/environments/environment.ts` already had an `api.baseUrl` field, and nothing imported it. The live URL came from `config.ts` instead.
- The same URL had to be kept in the Dockerfile default, the compose build arg, and the compose environment entry.
- A plain `ng build` without `--define` left `process.env.baseUrl` unset in the browser, so the fallback URL was used.
- Changing the compose environment did not change a pulled image.

## Current rule

The dashboard runs on the Angular SSR Node server (`projects/dashboard/src/server.ts`). `baseUrl` is set in the `infra/docker-compose.yml` `environment` and read at request time, so a pulled image picks up a compose change after `docker compose up -d`:

- `main.server.ts` passes `process.env.baseUrl` to `loadRuntimeConfig()` for the server-rendered `/settings-first-time-configs`.
- `GET /bootstrap-config.json` returns `{ "baseUrl": "..." }`. `main.ts` reads it before bootstrap and passes it to `loadRuntimeConfig()`.
- When `baseUrl` is unset or invalid, `loadRuntimeConfig()` uses `environment.ts` `api.baseUrl`.

The browser no longer saves a Base URL, and the settings pages no longer edit it. Do not inline `process.env.baseUrl` into `config.ts` again.
