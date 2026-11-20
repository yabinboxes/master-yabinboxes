# Civo observability (incomplete)

Intended to install a Helm chart (filename says OpenTelemetry) into a Civo Kubernetes cluster. **This project will not apply as-is** because it depends on a cluster resource that is not defined here.

**Path:** `v1/modules/dev/civo/observability`

## Implementation

| Resource / data | Name | Purpose |
|---|---|---|
| `data.civo_kubernetes_cluster` | `k8s_demo_1` | Looks up cluster `k8s_demo_1`. `depends_on` `civo_kubernetes_cluster.k8s_demo_1`, which **does not exist** in this module. |
| `kubernetes_namespace` | `helmnamespace` | Namespace `var.namespace`. |
| `helm_release` | `helmrelease` | Installs `var.chart` from `var.repository` with `var.values`. |

Providers: `civo/civo` `~> 1.1.0`, `hashicorp/helm` `2.16.0`, `hashicorp/kubernetes` `2.33.0`, `gavinbunney/kubectl` `1.14.0`. Helm, Kubernetes, and kubectl authenticate from the cluster kubeconfig. The `kubectl` provider is unused. Terraform `required_version` is `>= 0.13.0`. No `outputs.tf`.

```
provider.tf        # providers + broken cluster data source
opentelemetry.tf   # namespace + generic helm_release
variables.tf       # helm inputs + civo_token
backend.tf         # backend "s3" {}
```

`civo_token` is not marked `sensitive`. Default chart/name/repository values (`default` / `no-name`) are placeholders, not an OpenTelemetry chart.

## Usage

Do not apply until a `civo_kubernetes_cluster.k8s_demo_1` resource exists in this root module (or the data source is rewritten to look up an existing cluster without `depends_on` that resource).

When that is fixed:

```bash
export TF_VAR_civo_token="..."
export TF_VAR_namespace="observability"
export TF_VAR_name="opentelemetry"
export TF_VAR_repository="https://open-telemetry.github.io/opentelemetry-helm-charts"
export TF_VAR_chart="opentelemetry-collector"
export AWS_ACCESS_KEY_ID="..."
export AWS_SECRET_ACCESS_KEY="..."
export TF_STATE_BUCKET="your-bucket-name"
export TF_STATE_KEY_PREFIX="v1/modules/dev/civo/observability/terraform.tfstate"
export TF_STATE_REGION="us-east-1"
export TF_STATE_ENCRYPT="true"

terraform init \
  -backend-config="bucket=${TF_STATE_BUCKET}" \
  -backend-config="key=${TF_STATE_KEY_PREFIX}" \
  -backend-config="region=${TF_STATE_REGION}" \
  -backend-config="encrypt=${TF_STATE_ENCRYPT}"
```

Inputs: [TERRAFORM_RULES.md](../../TERRAFORM_RULES.md). Remote state: [BACKEND_S3.md](../../BACKEND_S3.md).

## Inputs

| Name | Required | Default | Sensitive | Description |
|---|---|---|---|---|
| `civo_token` | yes | — | no (not marked) | Civo API token. |
| `namespace` | no | `default` | no | Kubernetes namespace. |
| `name` | no | `no-name` | no | Helm release name. |
| `repository` | no | `default` | no | Helm repo URL. |
| `chart` | no | `default` | no | Chart name. |
| `values` | no | `""` | no | Helm values YAML string. |

## Outputs

None.

## Docs

- [helm_release](https://registry.terraform.io/providers/hashicorp/helm/latest/docs/resources/release)
- [civo_kubernetes_cluster](https://registry.terraform.io/providers/civo/civo/latest/docs/resources/kubernetes_cluster)
