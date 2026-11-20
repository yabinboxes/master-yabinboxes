# Services

A service is a Docker Compose deployment. In `hetzner-iac`, `type: docker_compose` does not run Terraform. The workflow resolves `host`, copies the caller `infra` directory to that host, and runs `init.sh`. Snow notify is `SERVICE`.

`host` is the Snow `name` of a server created with `type: hcloud_server`. It is not an IP in these examples.

File: `yabinboxes/main-examples/hetzner/hetznez stateless/services/.github/workflows/service-stateless.yml`

The workflow first creates the server with the same `type`, `name`, and `type_values` as `server-stateless.yml` (`name: server-hetzner-stateless`). The service job waits for that job:

```yaml
deploy_service_on_hetzner:
  needs: create_server_on_hetzner
  uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
  with:
    type: docker_compose
    name: service-hetzner-stateless
    host: server-hetzner-stateless
    expected_url: server-hetzner-stateless:8080
  secrets:
    hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
    ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
    ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
    snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

`expected_url` is `hostname:port`. `hetzner-iac` replaces a hostname with the resolved host and keeps the port. The follow-up job prints `outputs.address`.

PostgreSQL is the service in `yabinboxes/main-examples/hetzner/hetznez stateless/combined/.github/workflows/example-2-stateless.yml`. That job uses `type: docker_compose`, `host: server-example-2-stateless`, `infra: service/infra`, and `expected_url: jdbc:postgresql://localhost:5432/postgres`. `env_values` is `DB_USER=postgres` and `DB_PASSWORD=admin`. The module writes `env_values` to `/tmp/.env` on the host before `init.sh`.

The comment in `example-1-stateless.yml` says to keep each server, service, resource, and application in its own repository. The combined files exist so one workflow can run the sequence.
