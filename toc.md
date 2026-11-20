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

Theme: infrastructure as code projects, reusable workflows, walkthrough, pitfalls, exercises, and examples.

- [Chapter 10 — Infrastructure as Code projects for cloud resources](./body/part-04-core-modules/chapter-10-infrastructure-as-code-projects/)
- [Chapter 11 — Hands-on Reusable Workflows](./body/part-04-core-modules/chapter-11-hands-on-reusable-workflows/)
- [Chapter 12 — Walkthrough](./body/part-04-core-modules/chapter-12-walkthrough/)
- [Chapter 13 — Common Pitfalls](./body/part-04-core-modules/chapter-13-common-pitfalls/)
- [Chapter 14 — Exercises](./body/part-04-core-modules/chapter-14-exercises/)
- [Chapter 15 — Examples](./body/part-04-core-modules/chapter-15-examples/)

## Part V — Maintenance and Scripts

Theme: dashboard code, supporting services, tests, maintainer scripts, and wrap-up.

- [Chapter 16 — Dashboard Code](./body/part-05-maintenance-and-scripts/chapter-16-dashboard-code/)
- [Chapter 17 — Dashboard Selfhosted Code](./body/part-05-maintenance-and-scripts/chapter-17-dashboard-selfhosted-code/)
- [Chapter 18 — Other services](./body/part-05-maintenance-and-scripts/chapter-18-other-services/)
- [Chapter 19 — Test Modules](./body/part-05-maintenance-and-scripts/chapter-19-test-modules/)
- [Chapter 20 — Maintainer Scripts](./body/part-05-maintenance-and-scripts/chapter-20-maintainer-scripts/)
- [Chapter 21 — Script Summary and Reports](./body/part-05-maintenance-and-scripts/chapter-21-script-summary-and-reports/)
- [Chapter 22 — Summary + Further Reading](./body/part-05-maintenance-and-scripts/chapter-22-summary-and-further-reading/)

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
