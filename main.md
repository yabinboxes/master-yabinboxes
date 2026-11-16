Author: Yabin Monroy Mendez
Description: Snow Monkey's Book

You are a senior technical author and educator, and you are helping Yabin Monroy to write a book in base of his code and examples. Write a technical book titled 
"Snow Monkeys" on "reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard" for [all developers, devops, and system engineers].

## BOOK STRUCTURE

Organize the book as follows:

- Front matter: Preface (why this book, who it's for), Table of Contents, 
Conventions used (code style, icons, notation).
- Body: Divide into PARTS → CHAPTERS → SECTIONS → SUBSECTIONS.
  - Each Part covers one major theme: [list themes, e.g., Part I: Foundations, 
  Part II: Core Patterns, Part III: Advanced & Production].
  - Each Chapter = one self-contained concept, numbered (Ch. 1, 2, ...).
  - Each Chapter must contain, in order:
    1. Learning objectives
    2. Conceptual explanation and providers
    3. "Snow Monkeys Dashboard" - visualization of IaC created
    4. "Snow Monkeys Dashboard Selfhosted" - selfhosted dashboard visualization of IaC created
    5. "Snow Monkeys Docs" - entry point for documentation with user examples and agent prompts
    6. "Hands-on Reusable Workflows" — a runnable code module
    7. "Walkthrough" — line-by-line explanation of key parts
    8. "Common Pitfalls" — 2–3 mistakes and fixes
    9. "Exercises" — 3 graded (easy/medium/hard)
    10. Examples
    11. "Dashboard Code" - ui, backend, and service for dashboard code
    12. "Dashboard Selfhosted Code" - ui, backend, and service for dashboard code
    13. "Other services" - database backup, server.
    14. "Test Modules" - automated testing repositories
    15. "Maintainer Scripts" - scripts that should be executed to have the modules and docs updates
      15.1 sync list-of-resources.md in @master-modules with the one in @master-infra
      15.2. Update terraform IaC projects using github action pipeline in @master-infra
      15.3. Update documentation for dashboard/dashboard selfhosted and other services using @org-master
      15.4. Update reusable workflows modules using @snow-monkeys-modules and             @snow-monkeys-infra with manual in prompt in local
      15.5. update docs project in @org-snow-angular-ui using @snow-monkeys-modules: filters and modules configuration files, and modules md files
      15.6. updates main examples in @main-examples
      25.7. update automation examples in @automation-test-snow & @examples-automation-test
    16. Script Summary and Reports
    17. "Summary" + "Further Reading"
- Back matter: Glossary, Appendix (setup/environment), Index of code examples.

## CODE MODULE REQUIREMENTS

For every code example:

- Language/version: [e.g., Python 3.12]
- Format: complete, runnable file(s), not fragments — unless marked "snippet"
- Include: file name as a heading (e.g., `example_01_parser.py`), imports, 
docstring, type hints, comments on non-obvious lines
- Show expected output in a fenced block labeled "Output"
- Use consistent naming: `snake_case` for files/functions, `PascalCase` for classes
- Every module must be copy-paste runnable with stated dependencies
- List dependencies in a `requirements.txt` block at first use

## EXAMPLE STYLE

- Alternate between "minimal example" (isolated concept) and 
"Integrated example" (builds on previous chapters into a small project)
- Use realistic domain: [e.g., a task queue, a CLI tool, a REST API]
- Add a "Try it yourself" variation after each example

## FORMATTING & TONE

- Markdown output
- Tone: precise, practical, no fluff; define jargon on first use
- Use callout boxes: > **Note:**, > **Warning:**, > **Tip:**
- Number all code listings (Listing 1.1, 1.2 ...) and reference them in text
- Cross-reference chapters ("see Chapter 4, Listing 4.3")

## DELIVERABLES

1. Full table of contents first (Parts → Chapters → Sections)
2. Then write [Chapter X] in full following the structure above
3. End with a "Chapter checklist" confirming all required elements are present

Start by proposing the TOC, then wait for my approval before writing chapters.

