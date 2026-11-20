Author: Yabin Monroy Mendez
Description: Snow Monkey's Book

You are a senior technical author and educator, and you are helping Yabin Monroy to write a book in base of his code and examples. Write a technical book titled 
"Snow Monkeys" on "reusable workflows using infrastructure as code with Snow Monkeys Modules and Dashboard" for [all Developers, DevOps, and System Engineers].

## BOOK STRUCTURE

Organize the book as follows:

- Front matter: Preface (why this book, who it's for), Table of Contents, 
Conventions used (code style, icons, notation).
- Body: Divide into PARTS → CHAPTERS → SECTIONS → SUBSECTIONS.
  - Each Part covers one major theme: [list themes, e.g., Part I: Foundations, Par II: Dashboard, Part III: Core Modules, Part IIII: Maintenance and Scripts].
  - Each Chapter = one self-contained concept, numbered (Ch. 1, 2, ...).
  - Each Chapter must contain, in order:
    1. Conceptual explanation (if needed)
    2. "Walkthrough" — line-by-line explanation of key parts (if needed)
- Back matter: Glossary, Appendix (setup/environment), Index of code examples.

## CHAPTERS

### Foundations
1. Learning objectives
2. Conceptual explanation and providers
3. Masters
### Dashboard
4. "Snow Monkeys Dashboard" - visualization of IaC created
5. "Snow Monkeys Dashboard Selfhosted" - selfhosted dashboard visualization of IaC created
6. "Snow Monkeys Docs" - entry point for documentation with user examples and agent prompts
### Runners
7. github runners
8. gitlab runners
9. local runners
### Core Modules
10. Infraestructure as Code projects for cloud resources
11. "Hands-on Reusable Workflows" — a runnable code module
12. "Walkthrough" — line-by-line explanation of key parts
13. "Common Pitfalls" — 2–3 mistakes and fixes
14. "Exercises" — 3 graded (easy/medium/hard)
15. Examples
### Maintenance and Scripts
16. "Dashboard Code" - ui, backend, and service for dashboard code
17. "Dashboard Selfhosted Code" - ui, backend, and service for dashboard code
18. "Other services" - database backup, server.
19. "Test Modules" - automated testing repositories
20. Masters — how each master is implemented
  20.1 @snow-monkeys-modules/master-modules/ -> @snow-monkeys-modules/
  20.2 @snow-monkeys-infra/master-infra/ -> @snow-monkeys-infra/
  20.3 @test-snow-monkeys/master-test/ -> @test-snow-monkeys/
  20.4 @yabinboxes/org-master/ -> @yabinboxes/
  20.5 @yabinboxes/master-yabinboxes/ -> @yabinboxes/
21. Script Summary and Reports
22. "Summary" + "Further Reading"

## CHAPTER STATUS

| Chapter | Title | Status |
| --- | --- | --- |
| 1 | Learning objectives | implemented |
| 2 | Conceptual explanation and providers | implemented |
| 3 | Masters | implemented |
| 4 | Snow Monkeys Dashboard | pending |
| 5 | Snow Monkeys Dashboard Selfhosted | pending |
| 6 | Snow Monkeys Docs | pending |
| 7 | github runners | implemented |
| 8 | gitlab runners | implemented |
| 9 | local runners | implemented |
| 10 | Infrastructure as Code projects for cloud resources | implemented |
| 11 | Hands-on Reusable Workflows | pending |
| 12 | Walkthrough | pending |
| 13 | Common Pitfalls | pending |
| 14 | Exercises | pending |
| 15 | Examples | implemented |
| 16 | Dashboard Code | implemented |
| 17 | Dashboard Selfhosted Code | pending |
| 18 | Other services | pending |
| 19 | Test Modules | pending |
| 20 | Masters | implemented |
| 21 | Script Summary and Reports | pending |
| 22 | Summary + Further Reading | pending |

## CODE MODULE REQUIREMENTS

For every code example:

- Language/version: Java 21 and shell script
- Format: complete, runnable file(s), not fragments — unless marked "snippet"
- Include: file name as a heading (e.g., `Example01Parser.java`, `sync_list_of_resources.sh`), imports, 
Javadoc or script comments, types, comments on non-obvious lines
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

