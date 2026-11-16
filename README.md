# Snow Monkeys — Book workspace

Writing workspace for **Snow Monkeys**: reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard.

Audience: developers, DevOps, and systems engineers.

- Authoring spec: [main.md](./main.md)
- Proposed table of contents: [toc.md](./toc.md)

## Layout

Matches `main.md` (`Front matter` → `PARTS` → `CHAPTERS` → `SECTIONS` → `SUBSECTIONS` → `Back matter`).

```
master-yabinboxes/
├── main.md                          # authoring spec (do not write chapters from here)
├── toc.md                           # proposed TOC — approve before writing chapters
├── _templates/chapter/              # required chapter skeleton
├── front-matter/
│   ├── preface.md
│   ├── table-of-contents.md
│   └── conventions.md
├── body/
│   ├── part-01-foundations/
│   ├── part-02-core-patterns/
│   └── part-03-advanced-production/
└── back-matter/
    ├── glossary.md
    ├── appendix-setup-environment.md
    └── index-of-code-examples.md
```

Every chapter is copied from `_templates/chapter/` and uses this section tree:

```
chapter-NN-slug/
├── README.md
├── 01-learning-objectives/
├── 02-conceptual-explanation-and-providers/   # concept, providers
├── 03-snow-monkeys-dashboard/
├── 04-snow-monkeys-dashboard-selfhosted/
├── 05-snow-monkeys-docs/                      # user-examples, agent-prompts
├── 06-hands-on-reusable-workflows/
├── 07-walkthrough/
├── 08-common-pitfalls/                        # pitfall-01..03
├── 09-exercises/                              # easy, medium, hard
├── 10-examples/                               # minimal, integrated, try-it-yourself
├── 11-dashboard-code/                         # ui, backend, service
├── 12-dashboard-selfhosted-code/              # ui, backend, service
├── 13-other-services/                         # database-backup, server
├── 14-test-modules/
├── 15-maintainer-scripts/
├── 16-script-summary-and-reports/
├── 17-summary-and-further-reading/            # summary, further-reading
└── chapter-checklist.md
```

## Writing process

1. Review and approve [toc.md](./toc.md).
2. Write one chapter at a time, following `_templates/chapter/`.
3. Fill the chapter checklist before moving on.

Section 6 (Hands-on Reusable Workflows) is written. Start at [Chapter 5](./body/part-02-core-patterns/chapter-05-reusable-workflows/06-hands-on-reusable-workflows/). Chapter 6 is the Docker runnable module. Chapters 7–9 retarget `yabinboxes/main-examples/` against `snow-monkeys-modules/`. Listings are indexed in [back-matter/index-of-code-examples.md](./back-matter/index-of-code-examples.md).
