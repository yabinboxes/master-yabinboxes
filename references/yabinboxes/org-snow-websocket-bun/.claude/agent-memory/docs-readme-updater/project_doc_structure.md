---
name: Project doc structure
description: Which documentation files exist, what each covers, and which files tend to change together
type: project
---

## Documentation files and their scope

| File | Audience | Coverage |
|------|----------|----------|
| `README.md` | External/quick-start | Features, quick start, config, scripts, Docker link, docs index |
| `CLAUDE.md` | Claude Code agent | Commands, architecture, key modules, env vars, runtime conventions, Docker/CI |
| `DOCS/README.md` | Docs index | Table of contents with one-line descriptions of each DOCS file |
| `DOCS/architecture.md` | Developer | Component descriptions, data flow diagram, method signatures |
| `DOCS/development.md` | Developer | Scripts, env vars, HTTP endpoints, testing, Docker, CI/CD, project layout, client usage example |
| `DOCS/messages.md` | Developer/client implementor | All WebSocket message types with field tables, delivery scoping note |

## Recurring update pairs

- Adding a new message type → update `DOCS/messages.md` and `CLAUDE.md` (message types list)
- Adding an env var → update `DOCS/development.md` (env vars table), `CLAUDE.md` (env vars table), `README.md` (config table)
- Adding an HTTP endpoint → update `DOCS/development.md` (HTTP endpoints table), `DOCS/architecture.md` (components section), `README.md` (HTTP endpoints table)
- Adding a new public method to WebSocketServer or WebSocketClient → update `DOCS/architecture.md` (components section)
- Adding/changing a CLI command → update `DOCS/development.md` (scripts table), `README.md` (scripts table), `CLAUDE.md` (commands block)

**Why:** These three entry points (README, CLAUDE.md, DOCS/) are read by different audiences and must stay in sync on commands, env vars, and endpoints.
