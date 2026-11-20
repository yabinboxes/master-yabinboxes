---
name: Documentation conventions
description: Style, formatting, and tone patterns used across all docs in this repo
type: feedback
---

Preserve these patterns when updating documentation.

**Why:** The docs were established with a consistent developer-first style and must remain coherent across README, CLAUDE.md, and DOCS/.

**How to apply:** Match these conventions for any new content added.

## Table formatting

- Pipe tables (not HTML). Column headers in title case.
- Three-column pattern for env vars: `Variable | Description | Default`
- Two-column pattern for scripts: `Command | Description`
- Three-column pattern for HTTP endpoints: `Endpoint | Method | Description`

## Tone and voice

- Present tense. Short sentences. No "will" or "should" for describing current behavior.
- Developer-first: skip explanations of obvious things; focus on non-obvious constraints.
- No trailing summaries or recaps after changes.
- Avoid emojis.

## Code blocks

- Always specify the language hint (`bash`, `ts`).
- Inline code for: file paths, method names, type names, env var names, CLI flags.

## Section ordering

`DOCS/development.md`: Requirements → Install → Scripts → Environment variables → HTTP endpoints → Manual testing → Running with Docker → CI/CD → Project layout → Using the client

`DOCS/architecture.md`: Overview → Components (server, scheduler, client) → Data flow

`README.md`: Features → Quick start → Configuration → HTTP endpoints → Scripts → Docker → Documentation

## What NOT to put in CLAUDE.md

- Content already fully covered in DOCS/. CLAUDE.md should give concise pointers and non-obvious notes, not duplicate full tables. Exception: env vars and commands are duplicated intentionally for agent context speed.
