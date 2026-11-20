---
name: snow-angular-ui
description: >-
  Guides the agent when working in the Snow Angular UI dashboard. Use when
  editing, adding features, or fixing bugs in this repository, or when the
  user refers to the dashboard or this Angular workspace.
---

# Snow Angular UI monorepo

Instructions for the agent when working in this repository.

## When to use

- User asks to change or add something in the **dashboard** app (deployments, import, settings, auth, profiles).
- User mentions this repo, “snow-angular-ui”, or “dashboard” in the context of editing code.
- User wants to run, build, or test the dashboard.
- User asks to create or restyle any UI (components, pages, layout, typography, icons). Follow **UI style** below.

## Instructions

1. **Identify the target**
   - **dashboard** — `projects/dashboard/`. Auth (GitLab or GitHub OAuth), API, routes under `dashboard` with `authGuard`. Interfaces in `app/interfaces/` (api/, model/). Key entry: `app.routes.ts`, `app/pages/dashboard/`, `app/components/`, `app/services/`.

2. **Follow repo conventions**
   - Standalone components only; use `inject()` for dependencies.
   - State with Angular Signals (`signal()`, `computed()`, `effect()`).
   - Templates: prefer `@if`, `@for`, `@switch` (control flow).
   - Styling: Tailwind CSS 4 + DaisyUI (`btn`, `input`, `tabs`, `loading`, `base-content`, etc.).
   - New interfaces go in `projects/dashboard/src/app/interfaces/` (`api/` or `model/`).

3. **Commands**
   - Install: `npm install --legacy-peer-deps`
   - Serve dashboard: `npm start` or `ng serve`
   - Build: `ng build dashboard` (add `--configuration production` for prod).
   - Test: `ng test` (dashboard).

4. **Before finishing**
   - Build the dashboard: `ng build dashboard`. Fix any build errors.
   - Do not remove or bypass `authGuard` on protected routes; use `DashboardAuth` / `HandleProfiles` for auth-dependent logic. GitLab and GitHub setup are in `docs/OAUTH_SETUP.md`.
   - For any UI change: check it against **UI style** below (no hard-coded colors, type scale, spacing, icons).

## UI style

Target look: the editorial, "developer course" style of https://aprenderust.dev/ (slab-serif display headings, humanist sans body, monospace labels, bordered cards, generous section spacing, thin line icons). Applies to the **dashboard**.

Values below were read from the computed styles of that site at a ~723px-wide viewport. Sizes that look fluid there (the `h1` and `h2`) should use `clamp()` and be checked at other widths. Anything marked *(guideline)* is a recommendation, not a measured value. Only the **typography, layout, spacing and icon/image treatment** are borrowed.

### Colors are not part of this style

- **Do not change the base colors.** Keep the existing DaisyUI theme (`@plugin "daisyui"` in `projects/dashboard/src/styles.css`, currently `dracula`) and page background (`bg-base-200`).
- Never copy the reference site's orange or its stone/white palette. Never hard-code hex/rgb in templates. Use theme tokens only. Map the reference's roles to tokens:

| Role in reference | Use here |
|---|---|
| Page background | `bg-base-200` (existing) |
| Card / surface | `bg-base-100` |
| 1px hairline borders | `border border-base-300` |
| Main text | `text-base-content` |
| Muted text (descriptions, counts) | `text-base-content/70`; fine print `text-base-content/60` |
| Accent (eyebrows, numbers, icons, primary button) | `text-primary`, `btn-primary` |
| Soft accent tile (icon background) | `bg-primary/10 ring-1 ring-inset ring-primary/30` |

### Fonts

Define once in `projects/dashboard/src/styles.css` with a Tailwind 4 `@theme` block. Bundle the font files with the app (e.g. `@fontsource/*` packages installed with `npm install --legacy-peer-deps`); do not load them from a CDN at runtime, because this dashboard is self-hosted and may run without internet access.

```css
@theme {
  --font-sans: "Fira Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Fira Mono", ui-monospace, SFMono-Regular, monospace;
  --font-display: "Alfa Slab One", Georgia, serif;   /* single weight (400) */
  --font-pixel: "Jersey 15", var(--font-mono);        /* optional: big section numerals only */
}
```

- **Body / UI text**: Fira Sans, weights 400, 500, 600, 700. Base `16px / 24px`.
- **Display**: Alfa Slab One, weight 400 only (never add `font-bold` to it). Use for page titles (`h1`, `h2`) only, never for table cells, buttons, or dense card bodies.
- **Mono**: Fira Mono for eyebrows, chips, counts, list-row titles, code, terminal blocks.

### Type scale

| Element | Font | Size / line-height | Weight | Letter-spacing | Notes |
|---|---|---|---|---|---|
| Hero `h1` | display | `56px / 1.02` | 400 | `-0.015em` | one per page, max. Use `clamp()` for small screens *(guideline)* |
| Section `h2` | display | `~29px / 1.12` | 400 | `-0.01em` | |
| Card / group `h3` | sans | `18px / 1.25` | 700 | `-0.02em` | |
| Body paragraph | sans | `16px / 1.65` | 400 | normal | muted color, `max-width: 30rem` (480px) for lead text |
| FAQ / disclosure title | sans | `16px / 1.5` | 600 | `-0.015em` | |
| Primary button label | sans | `14.4px (0.9rem) / 1.2` | 600 | normal | |
| Eyebrow (label above a title) | mono | `11px / 1.5` | 500 | `0.08em` | uppercase, accent color |
| Chip / pill, counts | mono | `11px` | 400 | normal | muted |
| List-row title | mono | `13px / 1.4` | 400 | `-0.02em` | |
| Inline `code` | mono | `0.84em` | 600 | normal | `px 4.7px, py 1.3px`, radius `4.8px`, 1px border |
| Terminal / code block | mono | `11.5px / 1.6` | 400 | normal | |
| Footer / fine print | mono | `10px–12px` | 400 | `-0.025em` at 10px | muted |

In Tailwind use arbitrary values where there is no matching step, e.g. `text-[11px] tracking-[0.08em] uppercase font-mono font-medium`.

### Layout

- **Header**: fixed, `h-14` (56px), `px-4`, 1px bottom border, brand left, actions right. Header actions are `36×36` square buttons, `rounded-lg`, 1px border.
- **Page flow = full-width "bands"**: each band is `py-18 px-6` (72px / 24px), separated by a 1px border. Content inside is centered with `max-w-4xl` (896px). Band order: eyebrow → `h2` → short muted paragraph → content.
- **Hero**: centered single column, text centered. Visual first (a framed "window"), then `h1`, lead paragraph, a row of chips, then the call-to-action buttons (one primary, one secondary). Faint square-grid background and a few low-opacity outline icons around the visual.
- **Window frame** (use for code, logs, deployment output): `rounded-2xl`, 1px border, large soft shadow, a slim title bar with three small dots on the left and a mono filename/title, dark body below. Terminal text is mono; success keywords in accent/success tokens.
- **Numbered steps / feature cards**: grid of cards, 1 column on mobile, 3 on `md`. Each card is `bg-base-100 border border-base-300 rounded-2xl p-[18px]` with internal `gap-1.5`. Content: icon tile, number (`01`, `02`, `03`), title, muted description *(number in mono, guideline)*.
- **Grouped list (syllabus / deployments / sources)**: one group per section. Group header = section number + uppercase mono title + `h3` + muted one-line description. Rows below are full-width links.
- **Row**: `rounded-lg`, padding `9.6px 8px 9.6px 6.4px`, CSS grid `[16px status icon] [1fr title] [auto count]`, gap `8.8px`. Title mono 13px, count mono 11px muted. Hover/active state: a subtle `bg-base-200`/`bg-base-300` change *(guideline)*.
- **Section heading in lists / side menus**: pixel numeral (`font-pixel`, `25.6px`, accent) + uppercase mono title (`11px`, `0.06em`, weight 500) + a mono progress/count (`[...] 0/5` style) in muted color.
- **FAQ**: native `<details>` / `<summary>`, 1px border around each item, `py-3.5` (≈14.4px) on the summary, `gap-4` between title and its indicator icon.
- **Footer note**: small mono text, muted, with a row/column `gap-3`–`gap-4`.

### Spacing

- Base unit is 4px. Prefer Tailwind steps `1.5 (6px) · 2 (8px) · 3 (12px) · 4 (16px) · 5 (20px) · 6 (24px)` for gaps and padding.
- Section vertical padding `72px` (`py-18`); horizontal page padding `24px` (`px-6`); header horizontal padding `16px`.
- Gaps between eyebrow, heading, paragraph and content: use `gap-3` (12px) inside a heading block and `mt-10` (40px) before the band's content *(guideline)*.
- Radii: chips `999px` (`rounded-full`), buttons `~10px` (`rounded-[10px]`), list rows and header buttons `8px` (`rounded-lg`), icon tiles `12px` (`rounded-xl`), cards and windows `16px` (`rounded-2xl`), inline code `~5px`.
- Borders are always **1px hairlines** (`border-base-300`). Shadows are rare: only on the window frame and on the primary button.

### Buttons, chips, icons, images

- **Primary button**: `btn btn-primary`, `px-6 py-[11px]`, `rounded-[10px]`, label 14.4px / 600, ends with an arrow `→`, and a soft glow `shadow-[0_1px_10px] shadow-primary/25`. One primary button per band.
- **Secondary / header buttons**: outline or ghost, 1px border, no shadow.
- **Chips**: `rounded-full border border-base-300 bg-base-100 px-2.5 py-1 font-mono text-[11px] text-base-content/70`, optional 12–14px icon with `gap-1.5`. Used in a wrapping row under the hero text (e.g. `Free · 26 lessons · 95 exercises`).
- **Icon tile**: `40×40`, `rounded-xl`, `bg-primary/10 ring-1 ring-inset ring-primary/30`, centered **20×20** line icon in `text-primary`.
- **Line icons**: stroke style, no fills, `currentColor`, 16–20px; `stroke-width` around 1.5 *(guideline)*. List-row status icons are `16px` and muted. Do not mix filled and outlined icon sets. The existing `svg.my-icon` / `svg.my-icon-link` classes in `projects/dashboard/src/styles.css` are the place to adjust size and stroke.
- **Decorative icons** in hero backgrounds: outline only, `opacity-40` or lower, `aria-hidden="true"`.
- **Illustrations / mascot**: small flat or pixel-art style, one per page at most, placed overlapping the top edge of the hero window frame. No stock photos or gradients. The snow-monkey sprites in `projects/dashboard/public/images/` (`cluster.png`, `service.png`, `application.png`) follow this: hand-placed pixel grids with 3–4 flat tones per material, no outline, no anti-aliasing, exported at a whole-number scale (4× the grid) and shown with `[image-rendering:pixelated]`. New sprites should do the same, and display height should be a whole multiple of the grid height so pixels stay even.
- **Avatars** (contributors, owners): `32×32`, `rounded-full`, 2px border in the surface color.
- **Always** add `alt` text to meaningful images and `aria-label` to icon-only buttons.

### Dashboard notes

- Dense, data-first screens. Use the display font only for the page title, eyebrows for section labels, rows/cards/chips for sources and deployments, and the window frame for deployment logs. Do not apply hero-sized spacing inside tables or card lists.

## Reference

- **AGENTS.md** (repo root) — Project summary, workspace structure, key paths, and conventions. Prefer AGENTS.md for paths and details; this skill gives the minimal workflow.
