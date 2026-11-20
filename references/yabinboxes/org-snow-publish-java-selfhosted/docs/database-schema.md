# Database schema

**Project:** `snow-publish-java-selfhosted` · Snow Publish Java  
**Schema:** `connectors`  
**Extension:** `uuid-ossp` (`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`). No table column in this schema uses a UUID type.

All tables are created with `CREATE TABLE IF NOT EXISTS`. Text columns are `NOT NULL` with a default, so inserts that omit a column store `''` (or the column-specific default below) rather than `NULL`.

## Tables

| Table | Role | Primary key | JPA entity |
|---|---|---|---|
| `data_source_snow_deployments_persistent` | Permanent audit record. Never deleted. Stores the full row, including tokens. | `snow_deployment_id` `bigint` `GENERATED ALWAYS AS IDENTITY` | `DataSourceSnowDeploymentsPersistent` |
| `data_source_snow_deployments_volatile` | Short-lived staging table. Rows are deleted after Stage 2 processes them. | `snow_deployment_id` `bigint` (copied from persistent; not generated) | `DataSourceSnowDeploymentsVolatile` |
| `snow_deployments_anonymous` | Public read model. No token. One row per unique `repository`. | `snow_deployment_id` `bigint` `GENERATED ALWAYS AS IDENTITY` | `SnowDeploymentsAnonymous` |
| `snow_deployments_{profile_id}` | Per-profile read model. Created at runtime. Same columns as `snow_deployments_anonymous`. One row per unique `repository`. | `snow_deployment_id` `bigint` identity (copied from anonymous) | none — native SQL; rows mapped to `SnowDeploymentsAnonymous` |
| `profile_owners` | User profiles. | `profile_id` `bigint` `GENERATED ALWAYS AS IDENTITY` | `ProfileOwners` |
| `tabs_anonymous` | Named tabs for grouping deployments in the UI. | `tab_id` `bigint` `GENERATED ALWAYS AS IDENTITY` | `TabsAnonymous` |
| `self_hosted` | Single self-hosted setup row. | `id` `bigint` `GENERATED ALWAYS AS IDENTITY` | `SelfHosted` |

`tabs_anonymous.tab_id` is `bigint`. Deployment tables store `tab_id` as `integer`.

---

## data_source_snow_deployments_persistent

**Table:** `connectors.data_source_snow_deployments_persistent`

Permanent audit record. The pipeline does not delete these rows. The row includes tokens.

**Index:** `idx_persistent_created_at` on `created_at DESC`.

| Column | Type | Null | Default |
|---|---|---|---|
| `snow_deployment_id` | `bigint` | no | identity |
| `snow_token` | `text` | no | `''` |
| `actor` | `text` | no | `''` |
| `actor_id` | `text` | no | `''` |
| `email` | `text` | no | `''` |
| `snow_type` | `text` | no | `''` |
| `sha` | `text` | no | `''` |
| `snow_name` | `text` | no | `''` |
| `provider` | `text` | no | `''` |
| `repository_owner` | `text` | no | `''` |
| `repository` | `text` | no | `''` |
| `git_type` | `text` | no | `''` |
| `environment` | `text` | no | `'development'` |
| `created_at` | `timestamptz` | no | `now()` |
| `status` | `text` | no | `'default'` |
| `payload` | `text` | no | `''` |
| `url` | `text` | no | `''` |
| `url_path` | `text` | no | `''` |
| `port` | `text` | no | `''` |
| `image` | `text` | no | `''` |
| `registry` | `text` | no | `''` |
| `notes` | `text` | no | `''` |
| `processed` | `integer` | no | `0` |
| `extras` | `text` | no | `''` |
| `description` | `text` | no | `''` |
| `health_check_url` | `text` | no | `''` |
| `health_check_time` | `text` | no | `''` |
| `liveness_type` | `text` | no | `''` |
| `liveness_status` | `text` | no | `'unknown'` |
| `liveness_response` | `text` | no | `''` |
| `terraform_output` | `text` | no | `''` |
| `terraform_vars` | `text` | no | `''` |
| `docker_output` | `text` | no | `''` |
| `docker_vars` | `text` | no | `''` |
| `license` | `text` | no | `'no-license'` |
| `tab_name` | `text` | no | `''` |
| `tab_id` | `integer` | no | `0` |

---

## data_source_snow_deployments_volatile

**Table:** `connectors.data_source_snow_deployments_volatile`

Short-lived staging table. Each row is deleted after Stage 2 processes it. `snow_deployment_id` is copied from the persistent row; it is not an identity column.

Columns, types, nullability, and defaults match `data_source_snow_deployments_persistent`. There is no extra index on this table.

| Difference from persistent | Value |
|---|---|
| Primary key | `snow_deployment_id bigint PRIMARY KEY` |
| Identity | none — value is copied from persistent |
| Index | none |

---

## snow_deployments_anonymous

**Table:** `connectors.snow_deployments_anonymous`

Public read model. This table has no `snow_token`, `sha`, `processed`, or `license` column. One row per unique `repository`.

**Constraint:** `uq_snow_deployments_anonymous_repository` — `UNIQUE (repository)`.

**Index:** `idx_anonymous_created_at` on `created_at DESC`.

| Column | Type | Null | Default |
|---|---|---|---|
| `snow_deployment_id` | `bigint` | no | identity |
| `snow_type` | `text` | no | `''` |
| `snow_name` | `text` | no | `''` |
| `provider` | `text` | no | `''` |
| `actor` | `text` | no | `''` |
| `actor_id` | `text` | no | `''` |
| `email` | `text` | no | `''` |
| `repository_owner` | `text` | no | `''` |
| `repository` | `text` | no | `''` |
| `git_type` | `text` | no | `''` |
| `environment` | `text` | no | `'development'` |
| `created_at` | `timestamptz` | no | `now()` |
| `updated_at` | `timestamptz` | no | `now()` |
| `status` | `text` | no | `''` |
| `url` | `text` | no | `''` |
| `url_path` | `text` | no | `''` |
| `port` | `text` | no | `''` |
| `image` | `text` | no | `''` |
| `registry` | `text` | no | `''` |
| `description` | `text` | no | `''` |
| `extras` | `text` | no | `''` |
| `payload` | `text` | no | `''` |
| `health_check_url` | `text` | no | `''` |
| `health_check_time` | `text` | no | `''` |
| `notes` | `text` | no | `''` |
| `color` | `text` | no | `''` |
| `liveness_type` | `text` | no | `''` |
| `liveness_status` | `text` | no | `'unknown'` |
| `liveness_response` | `text` | no | `''` |
| `terraform_output` | `text` | no | `''` |
| `terraform_vars` | `text` | no | `''` |
| `docker_output` | `text` | no | `''` |
| `docker_vars` | `text` | no | `''` |
| `tab_name` | `text` | no | `''` |
| `tab_id` | `integer` | no | `0` |

Columns present on the persistent and volatile tables and absent here: `snow_token`, `sha`, `processed`, `license`.

Columns present here and absent on the persistent and volatile tables: `updated_at`, `color`.

`status` defaults to `''` here. On the persistent and volatile tables it defaults to `'default'`.

---

## profile_owners

**Table:** `connectors.profile_owners`

User profiles.

| Column | Type | Null | Default |
|---|---|---|---|
| `profile_id` | `bigint` | no | identity |
| `email` | `text` | no | `''` |
| `actor` | `text` | no | `''` |
| `actor_id` | `text` | no | `''` |
| `snow_token` | `text` | no | `''` |
| `snow_token_pipeline` | `text` | no | `''` |
| `license` | `text` | no | `''` |
| `org` | `text` | no | `''` |
| `git_type` | `text` | no | `''` |
| `role_profile` | `text` | no | `'REGULAR'` |
| `created_at` | `timestamptz` | no | `now()` |

No secondary index or unique constraint is declared on this table.

---

## tabs_anonymous

**Table:** `connectors.tabs_anonymous`

Named tabs for grouping deployments in the UI.

| Column | Type | Null | Default |
|---|---|---|---|
| `tab_id` | `bigint` | no | identity |
| `tab_name` | `text` | no | `''` |
| `created_at` | `timestamptz` | no | `now()` |

### Seed

After the table exists, one default row is inserted when that name is not already present:

```sql
INSERT INTO "connectors".tabs_anonymous (tab_name)
SELECT 'Main Tab'
WHERE NOT EXISTS (
    SELECT 1 FROM "connectors".tabs_anonymous WHERE tab_name = 'Main Tab'
);
```

`tab_name` is not unique. The seed only skips the insert when a row named `Main Tab` already exists.

---

## self_hosted

**Table:** `connectors.self_hosted`

One setup row for the self-hosted service. A unique index on a constant allows only that row.

| Column | Type | Null | Default |
|---|---|---|---|
| `id` | `bigint` | no | identity |
| `first_time_flag` | `integer` | no | `1` |
| `created_at` | `timestamptz` | no | `now()` |
| `auth` | `text` | no | `gitlab` |
| `base_url` | `text` | no | `https://gitlab.com` |
| `client_id` | `text` | no | `''` |
| `redirect_uri` | `text` | no | `http://localhost:4200/login` |
| `host_base_url` | `text` | no | `''` |

**Index:** `uq_self_hosted_single_row` — unique on the constant `1`, so the table cannot hold a second row.

The init script inserts `first_time_flag = 1` when the table is empty. `created_at` is set by the column default.

---

## snow_deployments_{profile_id}

**Table:** `connectors.snow_deployments_{profile_id}`

Per-profile deployment table. The name is not fixed: `{profile_id}` is `profile_owners.profile_id`. Profile `3` gets `connectors.snow_deployments_3`.

This table is not in the static DDL below. `ProfileSnowDeploymentsRepository.createTableIfNotExists` creates it when a profile is inserted (`POST /connectors/profile`). `CREATE TABLE IF NOT EXISTS` leaves an existing table unchanged. The processing pipeline does not write this table. It upserts `snow_deployments_anonymous` instead.

Columns, types, nullability, and defaults match `snow_deployments_anonymous`. There is no `snow_token`, `sha`, `processed`, or `license` column. One row per `repository`. A later publish of the same repository updates that row (`ON CONFLICT (repository) DO UPDATE`).

`LIKE` copies columns, defaults, and the identity on `snow_deployment_id`. It does not copy the primary key, unique constraint, or index, so the method adds those next.

**Constraint:** `snow_deployments_{profile_id}_pkey` — `PRIMARY KEY (snow_deployment_id)`.

**Constraint:** `uq_snow_deployments_{profile_id}_repository` — `UNIQUE (repository)`.

**Index:** `idx_snow_deployments_{profile_id}_created_at` on `created_at DESC`.

```sql
CREATE TABLE IF NOT EXISTS connectors.snow_deployments_{profile_id}
    (LIKE connectors.snow_deployments_anonymous INCLUDING DEFAULTS INCLUDING IDENTITY);

ALTER TABLE connectors.snow_deployments_{profile_id}
    ADD CONSTRAINT snow_deployments_{profile_id}_pkey PRIMARY KEY (snow_deployment_id);

ALTER TABLE connectors.snow_deployments_{profile_id}
    ADD CONSTRAINT uq_snow_deployments_{profile_id}_repository UNIQUE (repository);

CREATE INDEX IF NOT EXISTS idx_snow_deployments_{profile_id}_created_at
    ON connectors.snow_deployments_{profile_id} (created_at DESC);
```

The `ALTER TABLE` statements run only when that constraint name is not already in `pg_constraint`.

`GET /connectors/get-snow-repository/all` reads this table when it exists. `DELETE /connectors/publish-snow-deployment` deletes a row from it by `repository`. `snow_deployments_anonymous` is the column template and the table the pipeline upserts.

---

## DDL

```sql
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
    terraform_output    text        NOT NULL DEFAULT '',
    terraform_vars      text        NOT NULL DEFAULT '',
    docker_output       text        NOT NULL DEFAULT '',
    docker_vars         text        NOT NULL DEFAULT '',
    license             text        NOT NULL DEFAULT 'no-license',
    tab_name            text        NOT NULL DEFAULT '',
    tab_id              integer     NOT NULL DEFAULT 0
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
    terraform_output    text        NOT NULL DEFAULT '',
    terraform_vars      text        NOT NULL DEFAULT '',
    docker_output       text        NOT NULL DEFAULT '',
    docker_vars         text        NOT NULL DEFAULT '',
    license             text        NOT NULL DEFAULT 'no-license',
    tab_name            text        NOT NULL DEFAULT '',
    tab_id              integer     NOT NULL DEFAULT 0
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
    terraform_output    text        NOT NULL DEFAULT '',
    terraform_vars      text        NOT NULL DEFAULT '',
    docker_output       text        NOT NULL DEFAULT '',
    docker_vars         text        NOT NULL DEFAULT '',
    tab_name            text        NOT NULL DEFAULT '',
    tab_id              integer     NOT NULL DEFAULT 0,
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

-- ============================================================
-- self_hosted
-- Single setup row.
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
```

---

## Related docs

- [business-logic.md](business-logic.md) — how the pipeline reads and writes these tables
- [process-deployments.md](process-deployments.md) — Stage 2 volatile processing
- [get-profile.md](get-profile.md) — `profile_owners` create and update
