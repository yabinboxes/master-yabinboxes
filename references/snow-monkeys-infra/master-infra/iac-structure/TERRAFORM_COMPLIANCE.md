# Terraform compliance — `iac-terraform`

How this spec maps to the checked-out code in [snow-monkeys-infra/iac-terraform](https://github.com/snow-monkeys-infra/iac-terraform). Source of truth is the Terraform tree, not `docs/project-structure.md` (that file is stale).

For workflow dispatch see [FLOW.md](FLOW.md). For expected module files see [INTERNAL.md](INTERNAL.md). For mapped inputs/outputs see [INPUTS_OUTPUTS.md](INPUTS_OUTPUTS.md).

Checked against local checkout: `v1/modules/dev/` and `v1/k8s/`.

---

## Contract a module must meet

A folder is **compliant** with this spec when all of the following are true.

| Rule | Required |
|---|---|
| Path | `v1/modules/<env>/<provider>/<resource>/` (`env` is `dev` today) |
| Files | `variables.tf`, `outputs.tf`, and `main.tf` or `<resource>.tf`. Provider may live in `main.tf` or `provider.tf` |
| Credentials | Sensitive token/key as a variable, set via `TF_VAR_*` (not hardcoded project/account) |
| Outputs | A primary id or public address the workflow can map to `server_ip` or `resource_id` |
| Independence | Does not require another stack (k8s namespace, Civo LB data, …) unless that is documented as a stack, not a module |
| Type | Listed in `list-of-resources.md` as `type -> server` or `type -> resource` |

Kubernetes stacks use a different path and are **not** type-dispatched:

```
v1/k8s/<stack>/<env>/
```

Compose types (`docker_compose`, `docker_compose_app`) never apply Terraform.

---

## Actual tree

What exists on disk today (tracked files only). `v1/not-in-use/` is gitignored. There is **no** `v1/modules/dev/aws/` and **no** `v1/modules/dev/civo/postgres/`.

```
iac-terraform/
├── README.md
├── .gitignore
├── docs/
│   ├── project-structure.md          # stale vs tree (see gaps)
│   └── modules/
│       ├── aws.md                    # empty stub
│       ├── hetzner-hcloud-server.md
│       └── hetzner-hcloud-server/
│           ├── inputs.md
│           └── outputs.md
└── v1/
    ├── modules/dev/
    │   ├── hetzner/
    │   │   ├── hcloud_server/        # compliant
    │   │   └── hcloud_firewall/      # compliant
    │   ├── cloudflare/
    │   │   └── dns/                  # partial
    │   ├── digitalocean/
    │   │   └── droplet/              # mostly compliant
    │   ├── gcp/
    │   │   └── compute/              # non-compliant
    │   └── civo/
    │       ├── bucket/               # partial
    │       ├── compute/              # stub
    │       └── observability/        # partial
    └── k8s/
        └── civo-traefik/dev/         # stack, not a module
```

---

## `list-of-resources.md` vs tree

| Provider | Listed resource | Type | Folder in repo | Status |
|---|---|---|---|---|
| Hetzner | `hcloud_server` | `server` | `v1/modules/dev/hetzner/hcloud_server` | Present, compliant |
| Hetzner | `hcloud_firewall` | `resource` | `v1/modules/dev/hetzner/hcloud_firewall` | Present, compliant |
| AWS | `aws_s3_bucket` | *(none)* | — | **Missing.** Only empty `docs/modules/aws.md` |
| — | `dns` | — | `v1/modules/dev/cloudflare/dns` | Present, not listed |
| — | `droplet` | — | `v1/modules/dev/digitalocean/droplet` | Present, not listed |
| — | `compute` | — | `v1/modules/dev/gcp/compute` | Present, not listed |
| — | `bucket` / `compute` / `observability` | — | `v1/modules/dev/civo/…` | Present, not listed |
| — | `civo-traefik` | — | `v1/k8s/civo-traefik/dev` | Present, not listed |

---

## Workflow output mapping (from real outputs)

| Workflow output | Terraform output that exists | Module |
|---|---|---|
| `server_ip` | `server_ipv4` | `hetzner/hcloud_server` |
| `server_ip` | `droplet_ip` | `digitalocean/droplet` |
| `resource_id` | `firewall_id` | `hetzner/hcloud_firewall` |
| `resource_id` | — | cloudflare/dns, civo/bucket, gcp/compute — **no `outputs.tf`** |
| `server_ip` | — | gcp/compute, civo/compute — **no address output** |
| stack | `load_balancer_ip` | `k8s/civo-traefik/dev` (not a workflow type output) |

---

## Per-module compliance

### `v1/modules/dev/hetzner/hcloud_server` — compliant (`type: server`)

| Item | In code |
|---|---|
| Files | `main.tf`, `variables.tf`, `outputs.tf`, `README_HCLOUD_SERVER.md` |
| Provider | `hetznercloud/hcloud` `~> 1.68`, Terraform `>= 1.3` |
| Resources | `hcloud_ssh_key.yabin`, `hcloud_server.cx23` |
| Required vars | `hcloud_token`, `ssh_public_key` |
| Defaults | `name = CX23`, `server_type = cx23`, `image = ubuntu-24.04`, `location = hel1`, `ipv4_enabled = true`, `ipv6_enabled = false` |
| Outputs | `server_id`, `server_ipv4` → `server_ip`, `server_status` |
| Notes | Unused `ssh_keys` variable is commented out. Key name is `${var.name}key`. Label `managed_by = terraform`. |

### `v1/modules/dev/hetzner/hcloud_firewall` — compliant (`type: resource`)

| Item | In code |
|---|---|
| Files | `main.tf`, `variables.tf`, `outputs.tf`, `README_HCLOUD_FIREWALL.md` |
| Provider | `hetznercloud/hcloud` `~> 1.68`, Terraform `>= 1.3` |
| Resources | `hcloud_firewall.this` |
| Required vars | `hcloud_token` |
| Defaults | `name = snow-firewall`, `labels = { managed_by = terraform }`, inbound ICMP + TCP 22/80/443, `apply_to = []` |
| Outputs | `firewall_id` → `resource_id`, `firewall_name`, `firewall_rules` |
| Notes | Independent of the server module. Empty `apply_to` means rules exist but attach to nothing until a server id or `label_selector` is passed. |

### `v1/modules/dev/digitalocean/droplet` — mostly compliant (`type: server`)

| Item | In code |
|---|---|
| Files | `droplet.tf`, `variables.tf`, `output.tf`, `provider.tf`, `README_DROPLET.md` |
| Resources | `digitalocean_droplet.web` |
| Required vars | `digitalocean_token` |
| Defaults | `region = nyc3`, `droplet_name = web-server`, `droplet_size = s-1vcpu-1gb`, `droplet_image = ubuntu-22-04-x64` |
| Outputs | `droplet_ip` → `server_ip` |
| Gaps | Comment says nyc2; default is `nyc3`. No SSH key resource (workflow bootstrap still needs a key on the droplet). Output file is `output.tf` not `outputs.tf`. |

### `v1/modules/dev/cloudflare/dns` — partial (`type: resource`)

| Item | In code |
|---|---|
| Files | `cloudflare.tf`, `variables.tf`, `provider.tf`, `README_DNS.md` |
| Provider | `cloudflare/cloudflare` `~> 4.0`, Terraform `>= 0.13` |
| Resources | `kubernetes_secret.cloudflare_api_key_secret`, `cloudflare_record.clcreative-all-cluster` |
| Vars | `cloudflare_email`, `cloudflare_api_key`, `cloudflare_zone_id`, `cloudflare_record_name` (default `*.connectorsapp.com`) |
| Outputs | **None** (`outputs.tf` missing) |
| Gaps | Record `value` is `data.civo_loadbalancer.traefik_lb.public_ip` — that data source is not in this folder. Secret `depends_on` `kubernetes_namespace.certmanager`, also not in this folder. Cannot apply standalone. Not a compliant isolated resource module. |

### `v1/modules/dev/gcp/compute` — non-compliant (`type: server` intended)

| Item | In code |
|---|---|
| Files | `compute-instance.tf`, `provider.tf`, `README_COMPUTE.md` |
| Provider | `hashicorp/google` `6.36.1`, Terraform `>= 0.13` |
| Resources | `google_compute_instance.default` |
| Vars / outputs | **None** |
| Hardcoded | `project = udemyiactraining`, `name = my-vm`, `machine_type = n1-standard-1`, `zone = us-central1-a`, image `ubuntu-minimal-2210-kinetic-amd64-v20230126` |
| Gaps | No `variables.tf`, no `outputs.tf`, no credential variable, no public IP output. Not usable as `TF_VAR_*` workflow apply. |

### `v1/modules/dev/civo/bucket` — partial (`type: resource` intended)

| Item | In code |
|---|---|
| Files | `bucket.tf`, `variables.tf`, `provider.tf`, `README_BUCKET.md` |
| Resources | `civo_object_store.snowmonkeysbackup` (name `snowmonkeysbackup`, 500 GB, `LON1`) |
| Vars | `civo-token`, `civo_UUID`, `name`, `node-count`, `node-size`, `region` — **k8s-shaped; unused by `bucket.tf`** |
| Outputs | **None** |
| Gaps | Store name/size/region are hardcoded. Variables do not drive the resource. No id output for `resource_id`. Token name is hyphenated (`civo-token` → `TF_VAR_civo-token`). |

### `v1/modules/dev/civo/compute` — stub

| Item | In code |
|---|---|
| Files | `provider.tf`, `README_COMPUTE.md` |
| Provider | `civo/civo` `~> 1.1.0`, Terraform `>= 0.13` |
| Resources / vars / outputs | **None** |
| Gaps | Folder exists but does not create compute. Do not map to `type: server` until a resource and `outputs.tf` exist. |

### `v1/modules/dev/civo/observability` — partial

| Item | In code |
|---|---|
| Files | `opentelemetry.tf`, `variables.tf`, `provider.tf`, `README_OBSERVABILITY.md` |
| Resources | `kubernetes_namespace.helmnamespace`, `helm_release.helmrelease` |
| Vars | `namespace`, `name`, `repository`, `chart`, `values`, `civo_token` (underscore, unlike `civo-token` elsewhere) |
| Outputs | **None** |
| Gaps | Generic Helm wrapper, not a pinned observability stack. Requires a Kubernetes provider/cluster. No `resource_id`. |

### `v1/k8s/civo-traefik/dev` — stack (not a four-type module)

| Item | In code |
|---|---|
| Files | `civo.tf`, `traefik.tf`, `cermanager.tf`, `data.tf`, `provider.tf`, `variables.tf`, `output.tf`, `README_K8S.md` |
| Resources | `civo_kubernetes_cluster.k8s_demo_1`, `civo_firewall.fw_demo_1`, Traefik + cert-manager Helm, `data.civo_loadbalancer.traefik_lb` |
| Vars | `civo-token`, `name` (`k8s_demo_1`), `node-count` (`2`), `node-size` (`g4s.kube.medium`), `region` (`NYC1`) |
| Outputs | `load_balancer_ip` |
| Notes | Path is `v1/k8s/…`, not `v1/modules/…`. Workflow type dispatch does not apply unless a future mapping is added. Filename `cermanager.tf` is the cert-manager file. |

### AWS `aws_s3_bucket` — missing

`list-of-resources.md` and `master-aws.md` name `aws_s3_bucket`. The repo has no `v1/modules/dev/aws/` directory. `docs/modules/aws.md` is empty. Do not document apply commands as if the module exists.

---

## File-layout compliance

| Path | `variables.tf` | `outputs.tf` / `output.tf` | Resource file | Provider | README |
|---|---|---|---|---|---|
| `hetzner/hcloud_server` | yes | `outputs.tf` | `main.tf` | in `main.tf` | `README_HCLOUD_SERVER.md` |
| `hetzner/hcloud_firewall` | yes | `outputs.tf` | `main.tf` | in `main.tf` | `README_HCLOUD_FIREWALL.md` |
| `digitalocean/droplet` | yes | `output.tf` | `droplet.tf` | `provider.tf` | `README_DROPLET.md` |
| `cloudflare/dns` | yes | **no** | `cloudflare.tf` | `provider.tf` | `README_DNS.md` |
| `gcp/compute` | **no** | **no** | `compute-instance.tf` | `provider.tf` | `README_COMPUTE.md` |
| `civo/bucket` | yes (unused by resource) | **no** | `bucket.tf` | `provider.tf` | `README_BUCKET.md` |
| `civo/compute` | **no** | **no** | **no** | `provider.tf` | `README_COMPUTE.md` |
| `civo/observability` | yes | **no** | `opentelemetry.tf` | `provider.tf` | `README_OBSERVABILITY.md` |
| `k8s/civo-traefik/dev` | yes | `output.tf` | split `.tf` | `provider.tf` | `README_K8S.md` |

Most `README_*.md` files outside Hetzner are empty stubs (one blank line).

---

## Credential names in code

| Provider | Variable in repo | `TF_VAR_*` |
|---|---|---|
| Hetzner | `hcloud_token` | `TF_VAR_hcloud_token` |
| DigitalOcean | `digitalocean_token` | `TF_VAR_digitalocean_token` |
| Cloudflare | `cloudflare_api_key`, `cloudflare_email`, `cloudflare_zone_id` | matching `TF_VAR_*` |
| Civo bucket / k8s | `civo-token` (hyphen) | `TF_VAR_civo-token` |
| Civo observability | `civo_token` (underscore) | `TF_VAR_civo_token` |
| GCP | none (hardcoded project) | — |
| AWS | none | — |

Hyphenated Terraform variables are an exception to [NAMING.md](NAMING.md) snake_case. Keep the name the module already uses.

---

## Gaps to close (code, not this spec)

Ordered so `*-iac` apply can use a folder without special cases.

1. **AWS** — create `v1/modules/dev/aws/aws_s3_bucket/` with `variables.tf`, `outputs.tf`, and a bucket id output. Add `type -> resource` in `list-of-resources.md`.
2. **GCP compute** — add `variables.tf` / `outputs.tf`, drop hardcoded project, export a public address as `server_ip`.
3. **Civo compute** — add a real instance (or cluster) resource and outputs, or remove the empty folder from the index.
4. **Civo bucket** — drive name/size/region from variables; add an id output; drop unused k8s variables.
5. **Cloudflare DNS** — either move it under the k8s stack, or drop the Civo LB / cert-manager dependencies and add `outputs.tf`.
6. **Civo observability** — pin chart/repo, add `outputs.tf`, align token name with `civo-token`.
7. **`list-of-resources.md`** — add the folders that already exist (`dns`, `droplet`, `compute`, `bucket`, …) or stop treating them as workflow targets.
8. **`docs/project-structure.md`** — add `hetzner/hcloud_firewall`; remove `civo/postgres`; do not list AWS until the folder exists.

---

## What `*-iac` may apply today

Safe to clone `iac-terraform` and `terraform apply` as a standalone module:

| Path | Type | Workflow output |
|---|---|---|
| `v1/modules/dev/hetzner/hcloud_server` | `server` | `server_ipv4` → `server_ip` |
| `v1/modules/dev/hetzner/hcloud_firewall` | `resource` | `firewall_id` → `resource_id` |
| `v1/modules/dev/digitalocean/droplet` | `server` | `droplet_ip` → `server_ip` |

Apply only as part of the Civo Traefik stack (not four-type dispatch):

| Path | Output |
|---|---|
| `v1/k8s/civo-traefik/dev` | `load_balancer_ip` |

Do **not** treat these as ready workflow targets until the gaps above are fixed: `cloudflare/dns`, `gcp/compute`, `civo/bucket`, `civo/compute`, `civo/observability`, `aws/aws_s3_bucket`.

---

## Related docs

- [FLOW.md](FLOW.md) — `provider` + `type` → module path
- [INTERNAL.md](INTERNAL.md) — expected files and how to add a provider
- [INPUTS_OUTPUTS.md](INPUTS_OUTPUTS.md) — workflow vs Terraform variables
- [EXAMPLES.md](EXAMPLES.md) — caller and local apply examples
- [NAMING.md](NAMING.md) — path and `TF_VAR_*` conventions
