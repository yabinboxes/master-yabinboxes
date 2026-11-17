# Table of Contents (workspace)

Status: **approved** (17 November 2026). Canonical book TOC: [front-matter/table-of-contents.md](./front-matter/table-of-contents.md).

Chapter 6 section 3 (Hands-on Example) is written. Implementations: `snow-monkeys-modules/`. Callers: `yabinboxes/main-examples/`.

Book: **Snow Monkeys**  
Subtitle: Reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard

Chapters follow `main.md` **CHAPTERS**. Each chapter uses the five-section contract: learning objectives (1–5 bullets), conceptual explanation, hands-on example (if needed), walkthrough, summary + further reading.

---

## Front matter

- [Preface](./front-matter/preface.md) — why this book, who it is for
- [Table of Contents](./front-matter/table-of-contents.md)
- [Conventions](./front-matter/conventions.md) — code style, icons, notation

---

## Part I — Foundations

Theme: how to read this book, and how providers and modules fit together.

- [Chapter 1 — Learning objectives](./body/part-01-foundations/chapter-01-learning-objectives/)
- [Chapter 2 — Conceptual explanation and providers](./body/part-01-foundations/chapter-02-conceptual-explanation-and-providers/)

## Part II — Dashboard

Theme: hosted dashboard, selfhosted dashboard, and docs.

- [Chapter 3 — Snow Monkeys Dashboard](./body/part-02-dashboard/chapter-03-snow-monkeys-dashboard/)
- [Chapter 4 — Snow Monkeys Dashboard Selfhosted](./body/part-02-dashboard/chapter-04-snow-monkeys-dashboard-selfhosted/)
- [Chapter 5 — Snow Monkeys Docs](./body/part-02-dashboard/chapter-05-snow-monkeys-docs/)

## Part III — Core Modules

Theme: reusable workflows, walkthrough, pitfalls, exercises, and examples.

- [Chapter 6 — Hands-on Reusable Workflows](./body/part-03-core-modules/chapter-06-hands-on-reusable-workflows/)
- [Chapter 7 — Walkthrough](./body/part-03-core-modules/chapter-07-walkthrough/)
- [Chapter 8 — Common Pitfalls](./body/part-03-core-modules/chapter-08-common-pitfalls/)
- [Chapter 9 — Exercises](./body/part-03-core-modules/chapter-09-exercises/)
- [Chapter 10 — Examples](./body/part-03-core-modules/chapter-10-examples/)

## Part IV — Maintenance and Scripts

Theme: dashboard code, supporting services, tests, maintainer scripts, and wrap-up.

- [Chapter 11 — Dashboard Code](./body/part-04-maintenance-and-scripts/chapter-11-dashboard-code/)
- [Chapter 12 — Dashboard Selfhosted Code](./body/part-04-maintenance-and-scripts/chapter-12-dashboard-selfhosted-code/)
- [Chapter 13 — Other services](./body/part-04-maintenance-and-scripts/chapter-13-other-services/)
- [Chapter 14 — Test Modules](./body/part-04-maintenance-and-scripts/chapter-14-test-modules/)
- [Chapter 15 — Maintainer Scripts](./body/part-04-maintenance-and-scripts/chapter-15-maintainer-scripts/)
- [Chapter 16 — Script Summary and Reports](./body/part-04-maintenance-and-scripts/chapter-16-script-summary-and-reports/)
- [Chapter 17 — Summary + Further Reading](./body/part-04-maintenance-and-scripts/chapter-17-summary-and-further-reading/)

---

## Back matter

- [Glossary](./back-matter/glossary.md)
- [Appendix — Setup and environment](./back-matter/appendix-setup-environment.md)
- [Index of code examples](./back-matter/index-of-code-examples.md)

---

## Chapter section contract

Every chapter folder contains these **section folders**, in this order (from `main.md` BOOK STRUCTURE):

1. `01-learning-objectives/` — 1–5 bullets
2. `02-conceptual-explanation/` — diagrams described in text if needed
3. `03-hands-on-example/` — runnable module, if needed
4. `04-walkthrough/` — line-by-line
5. `05-summary-and-further-reading/` — `summary.md`, `further-reading.md`
6. `chapter-checklist.md`
