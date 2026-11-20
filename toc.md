# Table of Contents (proposed)

Status: **awaiting approval**. Do not write full chapters until this TOC is approved.

Book: **Snow Monkeys**  
Subtitle: Reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard

Chapters follow `main.md` **CHAPTERS**. Each chapter uses the contract in `main.md`: conceptual explanation (if needed), then walkthrough (if needed).

---

## Front matter

- [Preface](./front-matter/preface.md) — why this book, who it is for
- [Table of Contents](./front-matter/table-of-contents.md)
- [Conventions](./front-matter/conventions.md) — code style, icons, notation

---

## Part I — Foundations

Theme: how to read this book, how providers and modules fit together, and the master catalogs.

- [Chapter 1 — Learning objectives](./body/part-01-foundations/chapter-01-learning-objectives/)
- [Chapter 2 — Conceptual explanation and providers](./body/part-01-foundations/chapter-02-conceptual-explanation-and-providers/)
- [Chapter 3 — Masters](./body/part-01-foundations/chapter-03-masters/)

## Part II — Dashboard

Theme: hosted dashboard, selfhosted dashboard, and docs.

- [Chapter 4 — Snow Monkeys Dashboard](./body/part-02-dashboard/chapter-04-snow-monkeys-dashboard/)
- [Chapter 5 — Snow Monkeys Dashboard Selfhosted](./body/part-02-dashboard/chapter-05-snow-monkeys-dashboard-selfhosted/)
- [Chapter 6 — Snow Monkeys Docs](./body/part-02-dashboard/chapter-06-snow-monkeys-docs/)

## Part III — Runners

Theme: GitHub runners, GitLab runners, and local runners that execute the reusable workflows.

- [Chapter 7 — GitHub runners](./body/part-03-runners/chapter-07-github-runners/)
- [Chapter 8 — GitLab runners](./body/part-03-runners/chapter-08-gitlab-runners/)
- [Chapter 9 — Local runners](./body/part-03-runners/chapter-09-local-runners/)

## Part IV — Core Modules

Theme: reusable workflows, walkthrough, pitfalls, exercises, and examples.

- [Chapter 10 — Hands-on Reusable Workflows](./body/part-04-core-modules/chapter-10-hands-on-reusable-workflows/)
- [Chapter 11 — Walkthrough](./body/part-04-core-modules/chapter-11-walkthrough/)
- [Chapter 12 — Common Pitfalls](./body/part-04-core-modules/chapter-12-common-pitfalls/)
- [Chapter 13 — Exercises](./body/part-04-core-modules/chapter-13-exercises/)
- [Chapter 14 — Examples](./body/part-04-core-modules/chapter-14-examples/)

## Part V — Maintenance and Scripts

Theme: dashboard code, supporting services, tests, maintainer scripts, and wrap-up.

- [Chapter 15 — Dashboard Code](./body/part-05-maintenance-and-scripts/chapter-15-dashboard-code/)
- [Chapter 16 — Dashboard Selfhosted Code](./body/part-05-maintenance-and-scripts/chapter-16-dashboard-selfhosted-code/)
- [Chapter 17 — Other services](./body/part-05-maintenance-and-scripts/chapter-17-other-services/)
- [Chapter 18 — Test Modules](./body/part-05-maintenance-and-scripts/chapter-18-test-modules/)
- [Chapter 19 — Maintainer Scripts](./body/part-05-maintenance-and-scripts/chapter-19-maintainer-scripts/)
- [Chapter 20 — Script Summary and Reports](./body/part-05-maintenance-and-scripts/chapter-20-script-summary-and-reports/)
- [Chapter 21 — Summary + Further Reading](./body/part-05-maintenance-and-scripts/chapter-21-summary-and-further-reading/)

---

## Back matter

- [Glossary](./back-matter/glossary.md)
- [Appendix — Setup and environment](./back-matter/appendix-setup-environment.md)
- [Index of code examples](./back-matter/index-of-code-examples.md)

---

## Chapter section contract

Every chapter folder contains these **section folders**, in this order (from `main.md` BOOK STRUCTURE). Omit a section when that chapter does not need it.

1. `01-conceptual-explanation/` — prose, diagrams in text if needed
2. `02-walkthrough/` — line-by-line
3. `chapter-checklist.md`
