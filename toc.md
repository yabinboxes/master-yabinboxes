# Table of Contents (proposed)

Status: **awaiting approval**. Do not write full chapters until this TOC is approved.

Exception: section 6 (Hands-on Reusable Workflows) is written. Canonical how-to is Chapter 5; Chapter 6 is the Docker runnable module; Chapters 7–9 retarget `main-examples`.

Book: **Snow Monkeys**  
Subtitle: Reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard

---

## Front matter

- [Preface](./front-matter/preface.md) — why this book, who it is for
- [Table of Contents](./front-matter/table-of-contents.md)
- [Conventions](./front-matter/conventions.md) — code style, icons, notation

---

## Part I — Foundations

Theme: what Snow Monkeys is, how the pieces fit, and how to run it locally.

- [Chapter 1 — Why Snow Monkeys](./body/part-01-foundations/chapter-01-why-snow-monkeys/)
- [Chapter 2 — Architecture and execution flow](./body/part-01-foundations/chapter-02-architecture-and-execution-flow/)
- [Chapter 3 — Providers and module schema](./body/part-01-foundations/chapter-03-providers-and-module-schema/)
- [Chapter 4 — Local setup](./body/part-01-foundations/chapter-04-local-setup/)

## Part II — Core Patterns

Theme: reusable workflows, provider modules, Terraform generation, and dashboard visualization.

- [Chapter 5 — Reusable workflows](./body/part-02-core-patterns/chapter-05-reusable-workflows/)
- [Chapter 6 — Docker IaC](./body/part-02-core-patterns/chapter-06-docker-iac/)
- [Chapter 7 — Hetzner IaC](./body/part-02-core-patterns/chapter-07-hetzner-iac/)
- [Chapter 8 — Cloudflare IaC](./body/part-02-core-patterns/chapter-08-cloudflare-iac/)
- [Chapter 9 — Cloud provider modules](./body/part-02-core-patterns/chapter-09-cloud-provider-modules/)
- [Chapter 10 — Terraform infra generation](./body/part-02-core-patterns/chapter-10-terraform-infra-generation/)
- [Chapter 11 — Visualizing IaC on the dashboard](./body/part-02-core-patterns/chapter-11-visualizing-iac-on-the-dashboard/)

## Part III — Advanced & Production

Theme: docs, dashboard code (hosted and self-hosted), supporting services, tests, maintainer scripts, and production operations.

- [Chapter 12 — Snow Monkeys Docs and agent prompts](./body/part-03-advanced-production/chapter-12-snow-monkeys-docs-and-agent-prompts/)
- [Chapter 13 — Dashboard code](./body/part-03-advanced-production/chapter-13-dashboard-code/)
- [Chapter 14 — Dashboard self-hosted code](./body/part-03-advanced-production/chapter-14-dashboard-selfhosted-code/)
- [Chapter 15 — Other services](./body/part-03-advanced-production/chapter-15-other-services/)
- [Chapter 16 — Test modules](./body/part-03-advanced-production/chapter-16-test-modules/)
- [Chapter 17 — Maintainer scripts and reports](./body/part-03-advanced-production/chapter-17-maintainer-scripts-and-reports/)
- [Chapter 18 — Production operations](./body/part-03-advanced-production/chapter-18-production-operations/)

---

## Back matter

- [Glossary](./back-matter/glossary.md)
- [Appendix — Setup and environment](./back-matter/appendix-setup-environment.md)
- [Index of code examples](./back-matter/index-of-code-examples.md)

---

## Chapter section contract

Every chapter folder contains these **section folders**, in this order (from `main.md`):

1. `01-learning-objectives/`
2. `02-conceptual-explanation-and-providers/` — `concept.md`, `providers.md`
3. `03-snow-monkeys-dashboard/`
4. `04-snow-monkeys-dashboard-selfhosted/`
5. `05-snow-monkeys-docs/` — `user-examples.md`, `agent-prompts.md`
6. `06-hands-on-reusable-workflows/`
7. `07-walkthrough/`
8. `08-common-pitfalls/` — `pitfall-01.md` … `pitfall-03.md`
9. `09-exercises/` — `easy.md`, `medium.md`, `hard.md`
10. `10-examples/` — `minimal/`, `integrated/`, each with `try-it-yourself.md`
11. `11-dashboard-code/` — `ui.md`, `backend.md`, `service.md`
12. `12-dashboard-selfhosted-code/` — `ui.md`, `backend.md`, `service.md`
13. `13-other-services/` — `database-backup.md`, `server.md`
14. `14-test-modules/`
15. `15-maintainer-scripts/`
16. `16-script-summary-and-reports/`
17. `17-summary-and-further-reading/` — `summary.md`, `further-reading.md`
18. `chapter-checklist.md`
