# Configurable items

Catalogs that drive `/docs/modules` in the docs app. Both are static TypeScript arrays. Nothing is fetched from an API.

| Catalog | File |
|---|---|
| Modules | `projects/docs/src/app/data/modules-content-list.ts` |
| Filters | `projects/docs/src/app/data/filters-content-list.ts` |

Filter keys are typed by `TypesForm` and `FilterDefinition` in `projects/docs/src/app/interfaces/filters.interface.ts`.

```
modules-content-list.ts  →  ModulesList (computed)  →  ModuleCard
                                   ↑
filters-content-list.ts  →  DocsFilters (form)
                                   ↓
                             HandleFilters (signal)
```

`DocsFilters` builds its checkboxes and the initial form from `filters`. `HandleFilters` starts from `initialFilterState()`. `ModulesList` keeps a module when its type filter and its provider filter are both on.

## Modules

Export: `modules`.

Commented entries stay in the file and are not rendered. Only uncommented objects appear on `/docs/modules`.

| Field | Type | Used for |
|---|---|---|
| `id` | number | Stable identity of the entry. Not shown on the card. |
| `provider` | string | Provider pill, icon lookup, and the provider filter key. |
| `name` | string | Card title. |
| `type` | string | Type filter. See the mapping below. |
| `link` | string | External or `internal` reference. The card does not render this field. |
| `page` | string | Router link to the provider doc. |
| `description` | string | Card body, clamped to two lines. |

`provider` icons are chosen in `module-card.ts` (`snow`, `digitalocean`, `docker`, `civo`, `cloudflare`, `hetzner`). Any other provider uses `icons/snow.png`.

### Type values

The list compares a mapped type against `TypesForm`. These are the values in use:

| `type` on the module | Filter key |
|---|---|
| `application` | `applications` |
| `service` | `services` |
| `cluster` | `cluster` |
| anything else, including `resource` | the raw `type` string |

If that key is not on `TypesForm`, the type check passes and the card stays visible. `resource` (Hetzner resource) has no type checkbox, so that card is never hidden by the Types group.

### Provider values

The provider check uses `provider` as a `TypesForm` key. Current filter keys are `civo`, `digitalocean`, `cloudflare`, `azure`, `aws`, and `hetzner`. A provider that is not one of those keys, including `docker` and `snow`, always passes the provider check.

### Page and markdown

`page` is stored as `/docs/provider/<provider>/<mdFile>`. The card rebuilds the link as `/docs/provider/` plus every segment after the second one, so that stored path is the route.

The provider page loads:

```
projects/docs/public/md/providers/<provider>/<mdFile>.md
```

Add that file before uncommenting or adding a card. The route still resolves when the asset is missing; `ngx-markdown` requests that path. The “Markdown file not found.” alert is shown only when `provider` or `mdFile` is missing from the route.

### Add a module

Append an uncommented object:

```ts
{
  id: 55,
  provider: 'hetzner',
  name: 'Display name',
  type: 'service',
  link: 'https://example.com/docs',
  page: '/docs/provider/hetzner/my-module',
  description: 'Short description shown on the card.',
}
```

`type` should be `application`, `service`, or `cluster` when the card should follow a Types checkbox. `provider` should be one of the provider keys in `filters` when the card should follow a Providers checkbox.

## Filters

Export: `filters`. Helper: `initialFilterState()`.

`DocsFilters` groups the array by `group`, in first-seen order, and renders one checkbox per entry. Every entry starts from `enabled`.

| Field | Type | Used for |
|---|---|---|
| `key` | `keyof TypesForm` | Reactive form control name and the value `ModulesList` reads. |
| `label` | string | Checkbox label. |
| `group` | `'Providers'` \| `'Types'` | Fieldset the checkbox is rendered in. |
| `enabled` | boolean | Initial checked state. `true` means the matching modules start visible. |

Current entries:

| Group | Key | Label |
|---|---|---|
| Providers | `civo` | Civo |
| Providers | `digitalocean` | DigitalOcean |
| Providers | `cloudflare` | Cloudflare |
| Providers | `azure` | Azure |
| Providers | `aws` | AWS |
| Providers | `hetzner` | Hetzner |
| Types | `applications` | Applications |
| Types | `services` | Services |
| Types | `cluster` | Clusters |

`initialFilterState()` copies `key` → `enabled` into a `TypesForm`. `HandleFilters.filters` is that object. Unchecking a box calls `setFilters` with the form value, and `ModulesList` recomputes.

### Add a filter

1. Add the boolean property to `TypesForm` in `filters.interface.ts`. `key` is `keyof TypesForm`, so the array will not compile until the property exists.
2. Append a `FilterDefinition` in `filters-content-list.ts`.

```ts
{ key: 'docker', label: 'Docker', group: 'Providers', enabled: true },
```

Provider keys must equal the module `provider` string (`hetzner`, not `Hetzner`). Type keys must equal the mapped module type: `applications`, `services`, or `cluster`. A new group string also needs to be added to the `FilterGroup` union.

Modules whose provider or mapped type is not a key keep passing that check until the key exists on `TypesForm`.
