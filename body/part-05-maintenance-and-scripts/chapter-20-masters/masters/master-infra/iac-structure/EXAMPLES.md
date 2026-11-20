# Examples

Shared examples for every provider module in [snow-monkeys-infra/iac-terraform](https://github.com/snow-monkeys-infra/iac-terraform) and the matching `snow-monkeys-modules/<provider>-iac` workflow.

Typical sequence:

1. Create a host (`type: server`) — Hetzner server, DigitalOcean droplet, GCP compute, …
2. Create attached or standalone resources (`type: resource`) — firewall, DNS, S3, object store, …
3. Deploy a service (`type: docker_compose`).
4. Deploy an application (`type: docker_compose_app`).

Local Terraform examples match the module directories. Workflow examples call `<provider>-iac`. Compose types are provider-agnostic.

---

## Prerequisites

- An account on the target cloud
- That provider’s API credential(s) as GitHub secrets (see table)
- An **SSH key pair** for `type: server` and both compose types
- A **Snow token** and **Snow GitHub token** (clone `iac-terraform` + notify Snow)

| Secret | Providers / types | Description |
|---|---|---|
| `HCLOUD_TOKEN` | Hetzner `server`, `resource` | `TF_VAR_hcloud_token` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS `resource` | AWS provider credentials |
| `CLOUDFLARE_API_KEY` (+ email / zone) | Cloudflare `resource` | `TF_VAR_cloudflare_*` |
| `DIGITALOCEAN_TOKEN` | DigitalOcean `server` | `TF_VAR_digitalocean_token` |
| `CIVO_TOKEN` | Civo modules | `TF_VAR_civo-token` |
| `SSH_PUBLIC_KEY` / `SSH_PRIVATE_KEY` | `server`, compose | Remote access / server bootstrap |
| `SNOW_GITHUB_TOKEN` | all | Clone `iac-terraform`; remote private clones |
| `SNOW_TOKEN` | all | Snow pipeline token |
| `ENV_VALUES` | `server`, compose (optional) | Newline `KEY=VALUE` written to remote `.env` before `init.sh` |

---

## Pattern

```
v1/modules/dev/<provider>/<resource>/
```

`list-of-resources.md` maps each folder to `type -> server` or `type -> resource`. Pass those as workflow inputs:

```yaml
with:
  provider: hetzner          # folder under v1/modules/dev/
  type: resource             # server | resource | docker_compose | docker_compose_app
  resource: hcloud_firewall         # folder under that provider (optional if unique)
  name: snow-firewall
```

Local apply is the same for every module:

```bash
cd v1/modules/dev/<provider>/<resource>
export TF_VAR_<credential>="..."
terraform init
terraform plan
terraform apply
```

---

## Hetzner — hcloud_server

Path: `v1/modules/dev/hetzner/hcloud_server`. Defaults: `server_type = cx23`, `image = ubuntu-24.04`, `location = hel1`. Workflow `server_ip` ← `server_ipv4`.

### SKUs (confirm availability per location)

| Series | Slugs | Notes |
|---|---|---|
| Shared x86 | `cx23` `cx33` `cx43` `cx53` | Module default `cx23`. EU: `fsn1`, `nbg1`, `hel1` |
| Shared AMD | `cpx12` `cpx22` `cpx32` `cpx42` `cpx52` `cpx62` | Broader locations including `sin` |
| Dedicated AMD | `ccx13` `ccx23` `ccx33` `ccx43` `ccx53` `ccx63` | |
| Arm64 | `cax11` `cax21` `cax31` `cax41` | |

Deprecated: `cx22`/`cx32`/`cx42`/`cx52`, `cpx11`/`cpx21`/`cpx31`/`cpx41`/`cpx51`.

**Locations:** `fsn1` Falkenstein, `nbg1` Nuremberg, `hel1` Helsinki (default), `ash` Ashburn, `hil` Hillsboro, `sin` Singapore.

**Images:** `ubuntu-24.04` (default), `ubuntu-22.04`, `debian-12`, `fedora-41`, `rocky-9`, `almalinux-9`.

### Local Terraform

```bash
cd v1/modules/dev/hetzner/hcloud_server
export TF_VAR_hcloud_token="your-hetzner-api-token"
export TF_VAR_ssh_public_key="$(cat ~/.ssh/id_ed25519.pub)"
terraform init && terraform apply
ssh root@$(terraform output -raw server_ipv4)
```

### Workflow

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      provider: hetzner
      type: server
      name: my-cluster
      server_type: cx23
      image: ubuntu-24.04
      location: hel1
      snow_host_url: https://snow.internal
    secrets:
      hcloud_token: ${{ secrets.HCLOUD_TOKEN }}
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

Destroy is Terraform-only (no SSH):

```yaml
    with:
      provider: hetzner
      type: server
      name: my-cluster
      destroy: true
    secrets:
      hcloud_token: ${{ secrets.HCLOUD_TOKEN }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
```

---

## Hetzner — hcloud_firewall (`type: resource`)

Path: `v1/modules/dev/hetzner/hcloud_firewall`. Default rules: ICMP + TCP 22/80/443. Default `apply_to` is empty until you pass a server id or `label_selector`. Workflow `resource_id` ← `firewall_id`.

```bash
cd v1/modules/dev/hetzner/hcloud_firewall
export TF_VAR_hcloud_token="your-hetzner-api-token"
terraform init && terraform apply
terraform output firewall_id
```

```hcl
module "hetzner_firewall" {
  source       = "../../modules/dev/hetzner/hcloud_firewall"
  hcloud_token = var.hcloud_token
  name         = "snow-firewall"
  apply_to     = [{ label_selector = "managed_by=terraform" }]
}
```

```yaml
jobs:
  firewall:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      provider: hetzner
      type: resource
      resource: hcloud_firewall
      name: snow-firewall
    secrets:
      hcloud_token: ${{ secrets.HCLOUD_TOKEN }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
```

---

## Cloudflare — DNS (`type: resource`)

Path: `v1/modules/dev/cloudflare/dns`. Creates `cloudflare_record` and a Kubernetes secret for the API key.

```bash
cd v1/modules/dev/cloudflare/dns
export TF_VAR_cloudflare_email="you@example.com"
export TF_VAR_cloudflare_api_key="..."
export TF_VAR_cloudflare_zone_id="..."
# optional: TF_VAR_cloudflare_record_name="*.example.com"
terraform init && terraform apply
```

```yaml
jobs:
  dns:
    uses: snow-monkeys-modules/cloudflare-iac/.github/workflows/main.yml@main
    with:
      provider: cloudflare
      type: resource
      resource: dns
      name: connectors-wildcard
    secrets:
      cloudflare_api_key: ${{ secrets.CLOUDFLARE_API_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
```

---

## AWS — S3 (`type: resource`)

Path (from `list-of-resources.md`): `v1/modules/dev/aws/aws_s3_bucket`. Created/updated by `master-aws.md`.

```bash
cd v1/modules/dev/aws/aws_s3_bucket
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
# or TF_VAR_* as the module defines
terraform init && terraform apply
```

```yaml
jobs:
  bucket:
    uses: snow-monkeys-modules/aws-iac/.github/workflows/main.yml@main
    with:
      provider: aws
      type: resource
      resource: aws_s3_bucket
      name: snow-backup
    secrets:
      aws_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
```

---

## Other providers already in `iac-terraform`

### DigitalOcean droplet (`type: server`)

Path: `v1/modules/dev/digitalocean/droplet`. Defaults: `region = nyc3`, `droplet_size = s-1vcpu-1gb`, `droplet_image = ubuntu-22-04-x64`. Output `droplet_ip` → `server_ip`.

```bash
cd v1/modules/dev/digitalocean/droplet
export TF_VAR_digitalocean_token="..."
terraform init && terraform apply
terraform output -raw droplet_ip
```

### GCP compute (`type: server`)

Path: `v1/modules/dev/gcp/compute`. `google_compute_instance` in `us-central1`. Configure project credentials before apply.

### Civo bucket (`type: resource`)

Path: `v1/modules/dev/civo/bucket`. `civo_object_store` (example name `snowmonkeysbackup`).

```bash
cd v1/modules/dev/civo/bucket
export TF_VAR_civo-token="..."
terraform init && terraform apply
```

---

## Docker Compose — service

Provider-agnostic. Host can be an IP, hostname, or Snow service name.

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose
      name: my-service
      host: 1.2.3.4          # or a Snow name
      snow_host_url: https://snow.internal
      expected_url: my-service-name:8080   # optional; hostname replaced if not an IP
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

---

## Docker Compose — application

Same as `docker_compose` plus Docker cleanup on the remote host.

```yaml
jobs:
  deploy:
    uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
    with:
      type: docker_compose_app
      name: my-app
      host: my-app-server
      snow_host_url: https://snow.internal
      expected_url: my-app-server:3000
      health_url: https://my-app.example/health   # optional liveness
    secrets:
      ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY }}
      ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }}
      snow_github_token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      snow_token: ${{ secrets.SNOW_TOKEN }}
      env_values: ${{ secrets.ENV_VALUES }}
```

```yaml
  post-deploy:
    needs: deploy
    runs-on: ubuntu-22.04
    steps:
      - run: |
          echo "Host address: ${{ needs.deploy.outputs.address }}"
          echo "Running container: ${{ needs.deploy.outputs.container_name }}"
```

---

## `env_values` format

`server`, `docker_compose`, and `docker_compose_app` accept newline-separated `KEY=VALUE` pairs:

```
DATABASE_URL=postgres://user:pass@host:5432/db
API_KEY=abc123
PORT=3000
NODE_ENV=production
```

Written to `/tmp/deployment-script/.env` (or `/tmp/initial-setup/.env` for `type: server`) before `init.sh`. Resource modules do not consume `env_values`.

---

## Related docs

- [FLOW.md](FLOW.md) — provider + type dispatch
- [INPUTS_OUTPUTS.md](INPUTS_OUTPUTS.md) — workflow and module inputs/outputs
- [INTERNAL.md](INTERNAL.md) — adding a provider or resource
- [NAMING.md](NAMING.md) — string format conventions
- [TERRAFORM_COMPLIANCE.md](TERRAFORM_COMPLIANCE.md) — checkout vs this spec
