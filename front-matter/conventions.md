# Conventions used in this book

> Status: stub — write after TOC approval.

## Chapter shape

The body is four parts, from `main.md` **CHAPTERS**: Foundations, Dashboard, Core Modules, Maintenance and Scripts. Every chapter has five sections, in order: learning objectives (1–5 bullets), conceptual explanation, hands-on example (if needed), walkthrough, summary + further reading. The seventeen chapter titles are listed in [table-of-contents.md](./table-of-contents.md).

## Code style

- Language/version: stated per listing (Terraform, GitHub Actions YAML, Docker Compose, TypeScript, Java, Bun, SQL)
- Files are complete and runnable unless marked `snippet`
- File name is the heading (for example `` `example_01_parser.py` ``)
- `snake_case` for files and functions, `PascalCase` for classes
- Dependencies appear in a `requirements.txt` (or equivalent) block at first use

## Listings and output

- Number listings as **Listing 1.1**, **Listing 1.2**, and reference them in the text
- Show expected output in a fenced block labeled `Output`
- Cross-reference chapters: "see Chapter 4, Listing 4.3"

## Callouts

> **Note:** extra context that is not required to complete the step.

> **Warning:** a failure mode or destructive action.

> **Tip:** a shorter path or recommended default.

## Icons and notation

| Mark | Meaning |
| --- | --- |
| `workflow_call` | reusable GitHub Actions workflow |
| hosted | Snow Monkeys Dashboard on the org stack |
| selfhosted | Snow Monkeys Dashboard Selfhosted |
| CLUSTER / RESOURCE / SERVICE / APPLICATION | Snow notification kinds |
