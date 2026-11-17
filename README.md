# Snow Monkeys — Book workspace

Writing workspace for **Snow Monkeys**: reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard.

Audience: Developers, DevOps, and System Engineers.

- Authoring spec: [main.md](./main.md)
- Approved table of contents: [front-matter/table-of-contents.md](./front-matter/table-of-contents.md)
- Workspace outline: [toc.md](./toc.md)

## Layout

Matches `main.md` (`Front matter` → `PARTS` → `CHAPTERS` → `SECTIONS` → `SUBSECTIONS` → `Back matter`).

```
master-yabinboxes/
├── main.md                          # authoring spec (do not write chapters from here)
├── toc.md                           # approved workspace outline (folder links)
├── _templates/chapter/              # required chapter skeleton
├── front-matter/
│   ├── preface.md
│   ├── table-of-contents.md
│   └── conventions.md
├── body/
│   ├── part-01-foundations/
│   ├── part-02-dashboard/
│   ├── part-03-core-modules/
│   └── part-04-maintenance-and-scripts/
└── back-matter/
    ├── glossary.md
    ├── appendix-setup-environment.md
    └── index-of-code-examples.md
```

Seventeen chapters (from `main.md` **CHAPTERS**). Every chapter is copied from `_templates/chapter/` and uses this section tree:

```
chapter-NN-slug/
├── README.md
├── 01-learning-objectives/            # 1–5 bullets
├── 02-conceptual-explanation/         # diagrams in text if needed
├── 03-hands-on-example/               # runnable module, if needed
├── 04-walkthrough/                    # line-by-line
├── 05-summary-and-further-reading/    # summary, further-reading
└── chapter-checklist.md
```

## Writing process

1. TOC is approved: [front-matter/table-of-contents.md](./front-matter/table-of-contents.md).
2. Write one chapter at a time, following `_templates/chapter/`.
3. Fill the chapter checklist before moving on.

Chapter 6 is written. Start at [Chapter 6](./body/part-03-core-modules/chapter-06-hands-on-reusable-workflows/). Listings are indexed in [back-matter/index-of-code-examples.md](./back-matter/index-of-code-examples.md).
