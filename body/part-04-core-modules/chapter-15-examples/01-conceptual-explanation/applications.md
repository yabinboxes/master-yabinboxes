# Applications

An application works similarly to a service, but with an additional build step. In `hetzner-iac`, `type: docker_compose_app` uses the same host resolution, `infra` copy, and `init.sh` as `docker_compose`, and it also cleans Docker space on the host before the copy. Snow notify is `APPLICATION`. `health_url` is not set in these examples, so the liveness job in `hetzner-iac` does not run.

File: `yabinboxes/main-examples/hetzner/hetznez stateless/application/.github/workflows/application-stateless.yml`

The workflow creates `hcloud_server` with `name: server-hetzner-stateless`, then:

```yaml
deploy_application_on_hetzner:
  needs: create_server_on_hetzner
  uses: snow-monkeys-modules/hetzner-iac/.github/workflows/main.yml@main
  with:
    type: docker_compose_app
    name: application-hetzner-stateless
    host: server-hetzner-stateless
    expected_url: server-hetzner-stateless:4321
  secrets:
    hcloud_token: ${{ secrets.HETZNER_CLOUD_TOKEN }}
    ssh_public_key: ${{ secrets.SSH_PUBLIC_KEY_TEST }}
    ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY_TEST }}
    snow_token_pipeline: ${{ secrets.SNOW_TOKEN_PIPELINE }}
```

`host` is the server Snow name. `name` is the application Snow name. The follow-up job prints `outputs.address`.

`yabinboxes/main-examples/hetzner/hetznez stateless/combined/.github/workflows/example-1-stateless.yml` runs the server and the application in one workflow. The server `name` is `server-example-1-stateless` and `infra` is `server/infra`. The application job sets `type: docker_compose_app`, `host: server-example-1-stateless`, `expected_url: server-example-1-stateless:4321`, and `infra: application/infra`. Its `name` is also `server-example-1-stateless`. The file comment says that is because it is the same repository.
