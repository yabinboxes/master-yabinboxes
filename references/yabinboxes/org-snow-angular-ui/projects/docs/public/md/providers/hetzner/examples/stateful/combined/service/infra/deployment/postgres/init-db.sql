CREATE SCHEMA IF NOT EXISTS snow;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- data_source_users
-- ============================================================
CREATE TABLE IF NOT EXISTS "snow".data_source_users (
    user_id             bigint      PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name                text        NOT NULL DEFAULT '',
    email               text        NOT NULL DEFAULT '',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
