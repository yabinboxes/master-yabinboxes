CREATE SCHEMA IF NOT EXISTS connectors;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- data_source_snow_deployments_persistent
-- Permanent audit record. Never deleted. Contains full data
-- including tokens.
-- ============================================================
CREATE TABLE IF NOT EXISTS "connectors".data_source_snow_deployments_persistent (
    snow_deployment_id  bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    snow_token          text        NOT NULL DEFAULT '',
    actor               text        NOT NULL DEFAULT '',
    actor_id            text        NOT NULL DEFAULT '',
    email               text        NOT NULL DEFAULT '',
    snow_type           text        NOT NULL DEFAULT '',
    sha                 text        NOT NULL DEFAULT '',
    snow_name           text        NOT NULL DEFAULT '',
    provider            text        NOT NULL DEFAULT '',
    repository_owner    text        NOT NULL DEFAULT '',
    repository          text        NOT NULL DEFAULT '',
    git_type            text        NOT NULL DEFAULT '',
    environment         text        NOT NULL DEFAULT 'development',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    status              text        NOT NULL DEFAULT 'default',
    payload             text        NOT NULL DEFAULT '',
    url                 text        NOT NULL DEFAULT '',
    url_path            text        NOT NULL DEFAULT '',
    port                text        NOT NULL DEFAULT '',
    image               text        NOT NULL DEFAULT '',
    registry            text        NOT NULL DEFAULT '',
    notes               text        NOT NULL DEFAULT '',
    processed           integer     NOT NULL DEFAULT 0,
    extras              text        NOT NULL DEFAULT '',
    description         text        NOT NULL DEFAULT '',
    health_check_url    text        NOT NULL DEFAULT '',
    health_check_time   text        NOT NULL DEFAULT '',
    liveness_type       text        NOT NULL DEFAULT '',
    liveness_status     text        NOT NULL DEFAULT 'unknown',
    liveness_response   text        NOT NULL DEFAULT '',
    license             text        NOT NULL DEFAULT 'no-license',
    tab_name            text        NOT NULL DEFAULT '',
    tab_id              integer     NOT NULL DEFAULT 0,
    terraform_output    text        NOT NULL DEFAULT '',
    terraform_vars      text        NOT NULL DEFAULT '',
    docker_output       text        NOT NULL DEFAULT '',
    docker_vars         text        NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_persistent_created_at
    ON "connectors".data_source_snow_deployments_persistent (created_at DESC);

-- ============================================================
-- data_source_snow_deployments_volatile
-- Short-lived staging table. Deleted after Stage 2 processes
-- each row. snow_deployment_id is copied from persistent.
-- ============================================================
CREATE TABLE IF NOT EXISTS "connectors".data_source_snow_deployments_volatile (
    snow_deployment_id  bigint      PRIMARY KEY,
    snow_token          text        NOT NULL DEFAULT '',
    actor               text        NOT NULL DEFAULT '',
    actor_id            text        NOT NULL DEFAULT '',
    email               text        NOT NULL DEFAULT '',
    snow_type           text        NOT NULL DEFAULT '',
    sha                 text        NOT NULL DEFAULT '',
    snow_name           text        NOT NULL DEFAULT '',
    provider            text        NOT NULL DEFAULT '',
    repository_owner    text        NOT NULL DEFAULT '',
    repository          text        NOT NULL DEFAULT '',
    git_type            text        NOT NULL DEFAULT '',
    environment         text        NOT NULL DEFAULT 'development',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    status              text        NOT NULL DEFAULT 'default',
    payload             text        NOT NULL DEFAULT '',
    url                 text        NOT NULL DEFAULT '',
    url_path            text        NOT NULL DEFAULT '',
    port                text        NOT NULL DEFAULT '',
    image               text        NOT NULL DEFAULT '',
    registry            text        NOT NULL DEFAULT '',
    notes               text        NOT NULL DEFAULT '',
    processed           integer     NOT NULL DEFAULT 0,
    extras              text        NOT NULL DEFAULT '',
    description         text        NOT NULL DEFAULT '',
    health_check_url    text        NOT NULL DEFAULT '',
    health_check_time   text        NOT NULL DEFAULT '',
    liveness_type       text        NOT NULL DEFAULT '',
    liveness_status     text        NOT NULL DEFAULT 'unknown',
    liveness_response   text        NOT NULL DEFAULT '',
    license             text        NOT NULL DEFAULT 'no-license',
    tab_name            text        NOT NULL DEFAULT '',
    tab_id              integer     NOT NULL DEFAULT 0,
    terraform_output    text        NOT NULL DEFAULT '',
    terraform_vars      text        NOT NULL DEFAULT '',
    docker_output       text        NOT NULL DEFAULT '',
    docker_vars         text        NOT NULL DEFAULT ''
);

-- ============================================================
-- snow_deployments_anonymous
-- Public read model. No token. One row per unique repository.
-- ============================================================
CREATE TABLE IF NOT EXISTS "connectors".snow_deployments_anonymous (
    snow_deployment_id  bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    snow_type           text        NOT NULL DEFAULT '',
    snow_name           text        NOT NULL DEFAULT '',
    provider            text        NOT NULL DEFAULT '',
    actor               text        NOT NULL DEFAULT '',
    actor_id            text        NOT NULL DEFAULT '',
    email               text        NOT NULL DEFAULT '',
    repository_owner    text        NOT NULL DEFAULT '',
    repository          text        NOT NULL DEFAULT '',
    git_type            text        NOT NULL DEFAULT '',
    environment         text        NOT NULL DEFAULT 'development',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    status              text        NOT NULL DEFAULT '',
    url                 text        NOT NULL DEFAULT '',
    url_path            text        NOT NULL DEFAULT '',
    port                text        NOT NULL DEFAULT '',
    image               text        NOT NULL DEFAULT '',
    registry            text        NOT NULL DEFAULT '',
    description         text        NOT NULL DEFAULT '',
    extras              text        NOT NULL DEFAULT '',
    payload             text        NOT NULL DEFAULT '',
    health_check_url    text        NOT NULL DEFAULT '',
    health_check_time   text        NOT NULL DEFAULT '',
    notes               text        NOT NULL DEFAULT '',
    color               text        NOT NULL DEFAULT '',
    liveness_type       text        NOT NULL DEFAULT '',
    liveness_status     text        NOT NULL DEFAULT 'unknown',
    liveness_response   text        NOT NULL DEFAULT '',
    tab_name            text        NOT NULL DEFAULT '',
    tab_id              integer     NOT NULL DEFAULT 0,
    terraform_output    text        NOT NULL DEFAULT '',
    terraform_vars      text        NOT NULL DEFAULT '',
    docker_output       text        NOT NULL DEFAULT '',
    docker_vars         text        NOT NULL DEFAULT '',
    CONSTRAINT uq_snow_deployments_anonymous_repository UNIQUE (repository)
);

CREATE INDEX IF NOT EXISTS idx_anonymous_created_at
    ON "connectors".snow_deployments_anonymous (created_at DESC);

-- ============================================================
-- profile_owners
-- User profiles.
-- ============================================================
CREATE TABLE IF NOT EXISTS "connectors".profile_owners (
    profile_id          bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email               text        NOT NULL DEFAULT '',
    actor               text        NOT NULL DEFAULT '',
    actor_id            text        NOT NULL DEFAULT '',
    snow_token          text        NOT NULL DEFAULT '',
    snow_token_pipeline text        NOT NULL DEFAULT '',
    license             text        NOT NULL DEFAULT '',
    org                 text        NOT NULL DEFAULT '',
    git_type            text        NOT NULL DEFAULT '',
    role_profile        text        NOT NULL DEFAULT 'REGULAR',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- tabs_anonymous
-- Named tabs for grouping deployments in the UI.
-- ============================================================
CREATE TABLE IF NOT EXISTS "connectors".tabs_anonymous (
    tab_id    bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tab_name  text        NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed default tab
INSERT INTO "connectors".tabs_anonymous (tab_name)
SELECT 'Main Tab'
WHERE NOT EXISTS (SELECT 1 FROM "connectors".tabs_anonymous WHERE tab_name = 'Main Tab');

-- Seed profiles
--INSERT INTO "connectors".profile_owners (email, actor, actor_id, snow_token, snow_token_pipeline, license, org)
--SELECT 'yabin.monroy.1@gmail.com', 'yabinboxes', '54486644', '1234', 'snow-1234', 'self', 'yabin-org'
--WHERE NOT EXISTS (SELECT 1 FROM "connectors".profile_owners WHERE email = 'yabin.monroy.1@gmail.com');

--INSERT INTO "connectors".profile_owners (email, actor, actor_id, snow_token, snow_token_pipeline, license, org)
--SELECT 'yabin.monroy@gmail.com', 'yabinboxes', '54486644', '2345', 'snow-2345', 'self', 'yabin-org-2'
--WHERE NOT EXISTS (SELECT 1 FROM "connectors".profile_owners WHERE email = 'yabin.monroy@gmail.com');

-- ============================================================
-- self_hosted
-- One record only. uq_self_hosted_single_row indexes the
-- constant 1, so a second insert fails.
-- ============================================================
CREATE TABLE IF NOT EXISTS "connectors".self_hosted (
    id              bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_time_flag integer     NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    auth            text        NOT NULL DEFAULT 'gitlab',
    base_url        text        NOT NULL DEFAULT 'https://gitlab.com',
    client_id       text        NOT NULL DEFAULT '',
    redirect_uri    text        NOT NULL DEFAULT 'http://localhost:4200/login',
    host_base_url   text        NOT NULL DEFAULT ''
);

ALTER TABLE "connectors".self_hosted
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

ALTER TABLE "connectors".self_hosted
    ADD COLUMN IF NOT EXISTS auth text NOT NULL DEFAULT 'gitlab';

ALTER TABLE "connectors".self_hosted
    ADD COLUMN IF NOT EXISTS base_url text NOT NULL DEFAULT 'https://gitlab.com';

ALTER TABLE "connectors".self_hosted
    ADD COLUMN IF NOT EXISTS client_id text NOT NULL DEFAULT '';

ALTER TABLE "connectors".self_hosted
    ADD COLUMN IF NOT EXISTS redirect_uri text NOT NULL DEFAULT 'http://localhost:4200/login';

ALTER TABLE "connectors".self_hosted
    ADD COLUMN IF NOT EXISTS host_base_url text NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS uq_self_hosted_single_row
    ON "connectors".self_hosted ((1));

INSERT INTO "connectors".self_hosted (first_time_flag)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM "connectors".self_hosted);
