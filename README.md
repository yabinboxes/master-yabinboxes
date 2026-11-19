# Snow Monkeys — Book workspace

Writing workspace for **Snow Monkeys**: reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard.

Audience: Developers, DevOps, and System Engineers.

- Authoring spec: [main.md](./main.md)
- Proposed table of contents: [toc.md](./toc.md)
- Front-matter TOC: [front-matter/table-of-contents.md](./front-matter/table-of-contents.md)

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
│   ├── part-02-dashboard/
│   ├── part-03-runners/
│   ├── part-04-core-modules/
│   └── part-05-maintenance-and-scripts/
└── back-matter/
    ├── glossary.md
    ├── appendix-setup-environment.md
    └── index-of-code-examples.md
```

Twenty-one chapters (from `main.md` **CHAPTERS**). Every chapter is copied from `_templates/chapter/` and uses this section tree. Omit a section when that chapter does not need it.

```
chapter-NN-slug/
├── README.md
├── 01-conceptual-explanation/         # prose, diagrams in text if needed
├── 02-walkthrough/                    # line-by-line, if needed
└── chapter-checklist.md
```

## Writing process

1. Review and approve [toc.md](./toc.md).
2. Write one chapter at a time, following `_templates/chapter/`.
3. Fill the chapter checklist before moving on.

Chapter 10 is written. Start at [Chapter 10](./body/part-04-core-modules/chapter-10-hands-on-reusable-workflows/). Listings are indexed in [back-matter/index-of-code-examples.md](./back-matter/index-of-code-examples.md).
