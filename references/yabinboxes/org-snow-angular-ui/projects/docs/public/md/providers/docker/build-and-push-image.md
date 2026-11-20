## <a id="cloudflare-web-pages"></a>Cloudflare Web Pages

Module to build and push an image from the checkout code in Github action. The module requires proper credentials before use.
Supported Registries:
- Docker
- Github registry


### <a id="getting-started"></a>Getting Started

First, configure your ["registry user"](#steps-to-get-registry-user) and ["registry access token"](#steps-to-create-registry-token) properly in Docker Hub or Github registry and add the secrets to GitHub Actions.
Then create a GitHub Action to build and push image to registry and add the Snow Monkeys reusable workflows as shown:

```yaml
name: Deploy in cluster kubernetes

on:
  push:
    branches: [ "main" ]

# build - create image and push to registry
jobs:
  
  # default names in case name is not provided:
  # {registry user}/{github repository}-img:sha
  # {registry user}/{github repository}-img:latest       
  build-and-push-image:
    uses: snow-monkeys-modules/docker-iac/.github/workflows/main.yml@main
    with:
      type: build-and-push-image
      name: yabinm/snow-service-publish
      tag: latest
    secrets:
      registry-user: ${{ secrets.GLOBAL_DOCKERHUB_USERNAME }}
      registry-token: ${{ secrets.GLOBAL_DOCKERHUB_TOKEN }}
      snow-token: ${{ secrets.SNOW_TOKEN }}


```



### <a id="optional-inputs"></a>Optional inputs

- [registry](#optional-inputs) (String) Hub registry for the image. Default: "docker.io"
- [name](#optional-inputs) (String) Image name build. Default: { user }/{ repository name }-img:{ tag } and { user }/{ repository name }-img:latest
- [tag](#optional-inputs) (String) Image tag. Default: "latest" and sha.
- [platforms](#optional-inputs) (String) Build architectures. Default: "linux/amd64,linux/arm64,linux/arm64/v8"
- [enable-cloud-builder](#optional-inputs) (String) Option to enable Docker Build Cloud
- [endpoint](#optional-inputs) (String) Docker Build Cloud endpoint. Before is required to create the builder in [Docker](https://app.docker.com/)

### <a id="secrets"></a>Secrets

- [registry-user](#secrets) (String) Docker user name.
- [registry-token](#secrets) (String) Docker registry access token.
- [snow-token](#secrets) (String) Snow Monkeys pipeline token.

### <a id="steps-to-get-registry-user"></a>Steps to get registry user

1. **Log in** to [Docker Hub](https://hub.docker.com/).
2. Copy your username.
3. Store it as the `GLOBAL_DOCKERHUB_USERNAME` GitHub Actions secret.

### <a id="steps-to-create-registry-token"></a>Steps to create registry token

1. **Log in** to [Docker Hub](https://hub.docker.com/).
2. Open **Account Settings → Personal access tokens**.
3. Create a token with permission to read, write, and delete images.
4. Store it as the `GLOBAL_DOCKERHUB_TOKEN` GitHub Actions secret.

