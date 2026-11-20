Author: Yabin Monroy Mendez
Description: Caller outputs of the reusable workflows

# Workflow outputs

What a caller receives from `needs.<job>.outputs.*` after `workflow_call`. Values come from the called workflow's `on.workflow_call.outputs` block.

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      type: aws_instance
    secrets:
      snow_token: ${{ secrets.SNOW_TOKEN }}
      snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
  next:
    needs: deploy
    runs-on: ubuntu-22.04
    steps:
      - run: echo "${{ needs.deploy.outputs.server_ip }}"
```

A call fills one group. Terraform types fill `server_ip`, `terraform_output`, and `terraform_vars`. Compose types fill `address`, `container_name`, `docker_output`, and `docker_vars`. The other group is empty.

`destroy: true` skips the Terraform apply step, so `server_ip`, `terraform_output`, and `terraform_vars` stay empty.

---

## Who returns what

| Output | AWS | GCP | Azure | Digital Ocean | Hetzner | Cloudflare | Snow | Docker | Civo |
|---|---|---|---|---|---|---|---|---|---|
| `server_ip` | yes | yes | yes | yes | yes | yes | | | yes |
| `address` | yes | yes | yes | yes | yes | yes | | | yes |
| `container_name` | yes | yes | yes | yes | yes | yes | | | yes |
| `terraform_output` | yes | yes | yes | yes | yes | yes | | | yes |
| `terraform_vars` | yes | yes | yes | yes | yes | yes | | | yes |
| `docker_output` | yes | yes | yes | yes | yes | yes | | | yes |
| `docker_vars` | yes | yes | yes | yes | yes | yes | | | yes |
| `response` | | | | | | | yes | | |

Docker sets `container_name` on the job only. The workflow does not list it under `workflow_call.outputs`, so a caller cannot read it. Civo fills these outputs on Terraform types (`compute`, `bucket`, `observability`, `resource`) and on `docker_compose` / `docker_compose_app`. An empty `type`, or `type: kubernetes`, keeps the Kubernetes deploy and leaves the outputs empty.

Workflow files:

| Module | Workflow |
|---|---|
| AWS | `aws-iac/.github/workflows/main.yml` |
| GCP | `gcp-iac/.github/workflows/main.yml` |
| Azure | `azure-iac/.github/workflows/main.yml` |
| Digital Ocean | `digital-ocean-iac/.github/workflows/main.yml` |
| Hetzner | `hetzner-iac/.github/workflows/main.yml` |
| Cloudflare | `cloudflare-iac/.github/workflows/main.yml` |
| Snow | `snow-iac/.github/workflows/main.yml` |
| Docker | `docker-iac/.github/workflows/main.yml` |
| Civo | `civo-iac/.github/workflows/main.yml` |

---

## Shared cloud outputs

AWS, GCP, Azure, Digital Ocean, Hetzner, Cloudflare, and Civo use the same names. The implement job maps them from the one action step that ran. Compose outputs use `||`, so the step that ran supplies the value.

| Output | Set when `type` is | Value |
|---|---|---|
| `server_ip` | CLUSTER or RESOURCE terraform types | See [server_ip](#server_ip). |
| `terraform_output` | same as `server_ip` | `terraform output -json`, compacted to one line. |
| `terraform_vars` | same as `server_ip` | Non-secret `TF_VAR_*` values as one-line JSON. |
| `address` | `docker_compose` or `docker_compose_app` | SSH host after `http://` and `https://` are stripped. Empty host falls back to `expected_url`. |
| `container_name` | `docker_compose` or `docker_compose_app` | Full stdout of `bash init.sh` on the remote host. |
| `docker_output` | `docker_compose` or `docker_compose_app` | One-line JSON `{"container_name":"...","logs":"..."}` from `docker logs`. |
| `docker_vars` | `docker_compose` or `docker_compose_app` | Compose service fields as one-line JSON. See [docker_vars](#docker_vars). |

Default `type` values: Hetzner `hcloud_server` (CLUSTER), AWS `aws_instance` (CLUSTER), GCP `google_compute_instance` (CLUSTER), Digital Ocean `digitalocean_droplet` (CLUSTER; `digitalocean_droplet_autoscale` is also CLUSTER), Azure `azurerm_linux_web_app` (RESOURCE), Cloudflare `cloudflare_pages_project` (RESOURCE). Civo defaults `type` to empty, which keeps the Kubernetes deploy. All of them still treat `docker_compose` and `docker_compose_app` as the compose path.

### `server_ip`

Hetzner sets this with `terraform output -raw server_ipv4`. The apply step fails when that output is missing.

AWS, GCP, Azure, Digital Ocean, and Civo pick the first Terraform output that exists:

1. `server_ipv4` (CLUSTER VM modules alias this from `public_ip` / `droplet_ip`)
2. Provider host output: `public_ip`, `droplet_ip`, `default_hostname`, `fqdn`, `fully_qualified_domain_name`, or `public_ip_address`
3. Empty string, when none of those outputs exist. Missing `server_ipv4` does not fail a RESOURCE apply.

Cloudflare picks the first value that is set:

1. Wrangler deployment URL, when `type` or `resource` is `cloudflare_pages_project`. The first `https://…` line in the Wrangler log, with a trailing `.`, `,`, or `)` removed.
2. Raw Terraform output `server_ipv4`, when that output exists.
3. Terraform output `pages_project_subdomain`. A value that already starts with `http://` or `https://` is kept. Any other non-empty host is prefixed with `https://`.
4. Empty string, when neither Terraform output exists and Wrangler printed no URL.

### `terraform_output`

One-line JSON in Terraform's `output -json` shape:

```json
{"server_ipv4":{"sensitive":false,"type":"string","value":"203.0.113.10"}}
```

Keys are the module's output names. Each value has `sensitive`, `type`, and `value`. Snow notify parses this with `fromjson` when the string is non-empty, so it must stay valid JSON.

### `terraform_vars`

One-line JSON object of the `TF_VAR_*` environment variables present during apply. The `TF_VAR_` prefix is stripped from each key.

Names that contain `token`, `secret`, `password`, `passwd`, `private_key`, `access_key`, `credential`, or `api_key` are omitted, in either case. Example:

```json
{"name":"snow-server","server_type":"cx23","image":"ubuntu-22.04","location":"hel1"}
```

### `address` and `container_name`

`init.sh` in the caller's `infra/` directory runs on the remote host and prints the container name. That stdout is `container_name`.

`address` is the host used for SSH. Provider workflows resolve a Snow name to an IP before this step when `host` is not already an IPv4 address. `http://` and `https://` are removed before SSH. When that host is empty, `address` is `expected_url`.

### `docker_output`

One-line JSON `{"container_name":"<name>","logs":"<text>"}`. `<name>` is the first line of `init.sh` stdout, and `<text>` is `docker logs` stdout and stderr for that container.

`init.sh` stdout is the workflow output `container_name`. `docker logs` uses the first line of that stdout. A failed `docker logs` leaves `logs` empty and the step still succeeds.

### `docker_vars`

One-line JSON read from the caller's Compose file under `infra/` (`docker-compose.yml`, `docker-compose.yaml`, `compose.yml`, or `compose.yaml`). `docker compose config` resolves the file. Each service keeps `image`, `container_name`, `ports`, `expose`, `restart`, `command`, `entrypoint`, `working_dir`, `environment`, `volumes`, `networks`, and `depends_on` when those fields are set.

`container_name` is the Compose `container_name`, or the service name when that field is absent. Ports are `host:container` strings. Environment names that contain `token`, `secret`, `password`, `passwd`, `private_key`, `access_key`, `credential`, or `api_key` are omitted.

```json
{"services":{"web":{"image":"nginx:1.25","container_name":"web","ports":["8080:80"],"restart":"unless-stopped"}}}
```

A missing Compose file, or a failed `docker compose config`, leaves `docker_vars` as `{}`. Snow notify parses this with `fromjson`.

---

## Snow

| Output | Set when | Value |
|---|---|---|
| `response` | `workflow_type` is `get_resources` | Resolved host. |

| `resource_name` | `response` |
|---|---|
| IPv4 address | That address. No API call. |
| Snow name | `.url` from `GET <snow_host_url>/connectors/get-snow-url?snowName=<name>&actorId=<actor_id>&gitType=<git_type>`. |

The step fails when `.url` is missing, empty, or `null`. A bare IP `snow_host_url` is prefixed with `https://` before the call.

`workflow_type: notify` returns no output. Provider workflows call `get_resources` internally to resolve `host`. They do not re-export `response`.

---

## Docker

Job `notify_snow_monkeys_dashboard` sets `container_name` to `<name>:latest`. The `tag` input is not part of that string.

`on.workflow_call` in `docker-iac/.github/workflows/main.yml` has no `outputs` map, so `needs.<job>.outputs.container_name` is empty for callers.

---

## Civo

Kubernetes calls (`type` empty or `kubernetes`) leave every output empty. Terraform types fill `server_ip`, `terraform_output`, and `terraform_vars`. Compose types fill `address`, `container_name`, `docker_output`, and `docker_vars`.
