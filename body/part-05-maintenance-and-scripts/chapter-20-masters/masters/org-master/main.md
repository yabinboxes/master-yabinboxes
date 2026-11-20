Author: Yabin Monroy Mendez
Description: Snow Monkey's Services and execution process  

# Exec process


1. **snow-monkeys-infra** - Exect once a month monthly-master.yml (https://github.com/snow-monkeys-infra/master-infra) action

    output: Terrraform infraestructure generation for iac-terraform (https://github.com/snow-monkeys-infra/iac-terraform) in branch "updates"

    notes: master-modules describe the flow to generate terraform resources implementation for each provider and the worflow pipeline to be executed

2. **snow-monkeys-modules** - Add a definition module for each provider, for example:
    - docker-iac
    - hetzner-iac
    - cloudflare-iac

    notes: master-modules describe the flow that each module definition should have

3. **test-snow-monkeys** -  Add flow in how to perform automation test for all the modules, is exec once a month automation-test-snow (https://github.com/test-snow-monkeys/automation-test-snow) 
    then in feature flags execute the examples (https://github.com/test-snow-monkeys/examples) in base of the feature flags definitions 

    notes: master-test describe the flow in how 



# Services

**snow-monkeys-org** (https://github.com/snow-monkeys-org)

1. UI Dashboard & Documents
- snow-angular-ui 
<!-- Angular application for managing deployments, monitoring repositories, and managing user profiles with Firebase authentication. -->

2. API Services
- snow-publish-java
<!-- Spring Boot service that ingests Snow deployment events, processes them asynchronously, and exposes read APIs for profile-scoped and global deployment data. --> 
Auth: publish POST and get-snow-url use `snowTokenPipeline` Bearer; other `/connectors/**` use Firebase Bearer. Bearer validation **on by default** (`snow.auth.token-validation-enabled=true`). CORS allows all. See [api-authentication-and-security.md](api-authentication-and-security.md).

3. Liveness probe register
- snow-cron-bun

4. Postgres db
- snow-postgresdb-docker-compose

5. Server if is deploy to hetzner
- snow-server-hetzner

6. Push notification to Dashboard if something change
- snow-websocket-bun

7. Autimation test for Dashboard and APIs
- snow-test-playwright


# Local Setup 
contains the docker compose services to run in local mac-mini
