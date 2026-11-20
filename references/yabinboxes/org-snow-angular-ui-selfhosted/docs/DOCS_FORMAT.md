# Docs Format Rules

The `projects/docs` application is not in this repository. These rules applied to its markdown and are not a current content path.

**Monorepo project:** Snow Angular UI (`snow-angular-ui`) — **docs** app content under `projects/docs/public/md/`

Style guide for all markdown files under `projects/docs/public/md/`. Follow these rules when creating or editing documentation pages.

---

## File Structure

Every doc page must follow this section order:

```
# Title                    ← required, exactly one h1
One-line summary           ← what the module does and its main requirement

---

## Prerequisites           ← what the user needs before starting (secrets table)

---

## Getting Started         ← minimal working workflow example (code block)

---

## Optional Inputs         ← table: Input | Type | Default | Description

---

## Secrets                 ← table: Secret | Required | Description

---

## Steps to …              ← numbered step-by-step for each credential
```

Sections marked with `---` dividers keep pages scannable. Omit a section only if it genuinely does not apply (e.g. a page with no secrets).

---

## Headings

| Level | Tag | Usage |
|---|---|---|
| Page title | `#` | Exactly one per file, first line |
| Major section | `##` | Prerequisites, Getting Started, Optional Inputs, Secrets, Steps |
| Sub-section | `###` | Use inside a `##` section when needed |
| Do not use | `####` and below | Avoid — too much nesting hurts readability |

**Wrong** — title is `##` and content is wrong file:
```markdown
## Cloudflare Web Pages

Module to build and push an image...
```

**Correct:**
```markdown
# Hetzner VM

Module to deploy an application to a Hetzner Cloud virtual machine...
```

---

## Anchor Links

Never use inline anchor links to point to sections that do not exist in the file.

**Wrong:**
```markdown
configure your ["account id"](#steps-to-get-your-account-id)
- [registry-token](secrets)   ← missing #
```

**Correct options:**

- If the target section exists in the file, use `[text](#heading-slug)`.
- If there is no target section yet, write plain text until the section is added.
- Heading slugs are lowercase, spaces replaced with `-`: `## Steps to Get a Token` → `#steps-to-get-a-token`.

---

## Secrets and Inputs — Use Tables, Not Lists

Lists with broken anchors are hard to scan and link to nothing. Use markdown tables instead.

**Wrong:**
```markdown
Optional inputs:
- [registry](#optional-inputs) (String) Hub registry. Default: "docker.io"

Secrets:
- [registry-token](secrets) (String) Docker registry access token.
```

**Correct:**

### Optional Inputs table

| Input | Type | Default | Description |
|---|---|---|---|
| `registry` | String | `docker.io` | Hub registry for the image |
| `name` | String | `{user}/{repo}-img:{tag}` | Image name |

### Secrets table

| Secret | Required | Description |
|---|---|---|
| `registry-user` | Yes | Docker Hub username |
| `registry-token` | Yes | Docker registry access token |
| `snow-token` | Yes | Snow Monkeys pipeline token |

---

## Code Blocks

- Always specify the language after the opening fence: ` ```yaml `, ` ```bash `, ` ```ts `.
- Workflow examples must be complete and runnable — no placeholder ellipses.
- Use real secret names that match the secrets table in the same file.

**Wrong:**
```
```yaml
jobs:
  build-and-push-image:
    uses: snow-monkeys-modules/docker-iac/...
    secrets:
      type: build-and-push-image
      registry-user: ${{ secrets.GLOBAL_DOCKERHUB_USERNAME }}
```
```

(This says Hetzner but uses Docker secrets — copy-pasted content.)

**Correct:** workflow `uses:`, `with:`, and `secrets:` keys must match the module being documented.

---

## Prerequisites Section

List everything needed before running the workflow. Always include a secrets table with three columns: **Secret**, **Description**, and where to store it.

```markdown
## Prerequisites

- A [Provider] account and project
- A **Provider API token** with read/write permissions
- A **Snow token** for deployment status reporting

| Secret | Description |
|---|---|
| `PROVIDER_API_TOKEN` | Provider API token |
| `SNOW_TOKEN` | Snow Monkeys pipeline token |
```

---

## Step-by-Step Sections

Use numbered lists with **bold** action verbs. Each step should be a single action.

```markdown
## Steps to Get an API Token

1. **Log in** to [Provider Console](https://console.provider.com/).
2. Navigate to **Security → API Tokens**.
3. Click **Generate Token**, set permission to **Read & Write**.
4. Copy the token and save it as the `PROVIDER_API_TOKEN` GitHub secret.
```

Do not nest sub-bullets inside steps unless strictly necessary.

---

## Content Accuracy

- The title, summary, workflow example, inputs, and secrets must all describe **the same module**.
- Do not copy-paste from another module page and leave the old content.
- Check that every secret referenced in the `secrets:` block of the workflow example has a matching row in the Secrets table.

---

## Dividers

Use `---` to separate major sections. Do not use `***` or `___`.

---

## Trailing Content

- No trailing blank lines at the end of the file beyond one.
- No commented-out image embeds like `![[image.png]]` unless the image actually exists in the public assets.

---

## Quick Checklist Before Committing

- [ ] File starts with a single `#` title
- [ ] Title matches the actual module/provider being documented
- [ ] All anchor links point to sections that exist in the file
- [ ] Inputs and secrets use tables, not lists
- [ ] Workflow code block is complete and uses the correct `uses:` path
- [ ] Every secret in the workflow example has a row in the Secrets table
- [ ] Step sections exist for every credential referenced in Prerequisites
- [ ] No trailing blank lines or broken image embeds
