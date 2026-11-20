Author: Yabin Monroy Mendez
Description: Test Suite for modules

# automation-test-snow
- call automation-test-snow on manual execution

- feature flags:
    env:
      FEATURE_FLAG_TEST_ALL_MODULES: false
      FEATURE_FLAG_TEST_DOCKER: false
      FEATURE_FLAG_TEST_HETZNER: true
      FEATURE_FLAG_TEST_CLOUDFLARE: false
      FEATURE_FLAG_TEST_AWS: false
      FEATURE_FLAG_TEST_AZURE: false
      FEATURE_FLAG_TEST_GCP: false
      FEATURE_FLAG_TEST_DIGITALOCEAN: false


- checkout code

- call API github dispatch all github pipelines with:

    test-docker-modules:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4

          - name: Test Docker Modules if FEATURE_FLAG_TEST_DOCKER is enabled
            if: env.FEATURE_FLAG_TEST_DOCKER == 'true' || env.FEATURE_FLAG_TEST_ALL_MODULES == 'true'
            run: |
              echo "------ test docker modules ------"
              curl -L \
              -X POST \
              -H "Accept: application/vnd.github+json" \
              -H "Authorization: Bearer ${{ secrets.SNOW_GITHUB_TOKEN }}" \
              -H "X-GitHub-Api-Version: 2022-11-28" \
              https://api.github.com/repos/test-snow-monkeys/examples/dispatches \
              -d '{"event_type":"automation-docker-test-event","client_payload":{"unit":false,"integration":true, "feature_flag_test_docker": true}}'

      test-hetzner-modules:
        needs: test-docker-modules
        runs-on: ubuntu-latest
        if: (!cancelled() && (needs.test-docker-modules.result == 'success' || needs.test-docker-modules.result == 'skipped'))
        steps:
          - uses: actions/checkout@v4

          - name: Test Hetzner Modules if FEATURE_FLAG_TEST_HETZNER is enabled
            if: env.FEATURE_FLAG_TEST_HETZNER == 'true' || env.FEATURE_FLAG_TEST_ALL_MODULES == 'true'
            run: |
              echo "------ test hetzner modules ------"
              curl -L \
              -X POST \
              -H "Accept: application/vnd.github+json" \
              -H "Authorization: Bearer ${{ secrets.SNOW_GITHUB_TOKEN }}" \
              -H "X-GitHub-Api-Version: 2022-11-28" \
              https://api.github.com/repos/test-snow-monkeys/examples/dispatches \
              -d '{"event_type":"automation-hetzner-test-event","client_payload":{"unit":false,"integration":true, "feature_flag_test_hetzner": true}}'

    ...

      

## Test suite rules
- @test-suite-rules.md
- Order: 1. S3 state storage. 2. resource. 3. server. 4. docker_compose. 5. docker_compose_app. 6. destroy server
- Reference: @hetzner-test-suite.md and `examples/.github/workflows/test-hetzner.yml`

## Test bed for Snow Monkeys: event_type: automation-snow-monkey-test-event
- @snowmonkeys-test-suite.md
- Exception to @test-suite-rules.md. Order: checkout, notify, get_resources

## Test bed for Docker: event_type: automation-docker-test-event
- @docker-test-suite.md
- Exception to @test-suite-rules.md. One job: build_and_push_image

## Test bed for Hetzner: event_type: automation-hetzner-test-event
- @hetzner-test-suite.md
- S3, firewall, server create, and server destroy do not continue on fail
- A failed service or application deploy still destroys the server when the server was created

## Test bed for Cloudflare: event_type: automation-cloudflare-test-event
- @cloudflare-test-suite.md
- Order: S3 state, D1 resource, server, docker_compose, docker_compose_app, destroy server

## Test bed for AWS: event_type: automation-aws-test-event
- @aws-test-suite.md
- Order: S3 state, lambda resource, EC2 server, docker_compose, docker_compose_app, destroy server

## Test bed for Azure: event_type: automation-azure-test-event
- @azure-test-suite.md
- Order: S3 state, linux web app resource, server, docker_compose, docker_compose_app, destroy server

## Test bed for GCP: event_type: automation-gcp-test-event
- @gcp-test-suite.md
- Order: S3 state, storage bucket resource, compute server, docker_compose, docker_compose_app, destroy server

## Test bed for DigitalOcean: event_type: automation-digitalocean-test-event
- @digitalocean-test-suite.md
- Order: S3 state, resource, droplet server, docker_compose, docker_compose_app, destroy server

## Collect results - after a test bed is executed then at the end automation-test.yml is executed returning areport of success and failures
- automation-test.yml 


