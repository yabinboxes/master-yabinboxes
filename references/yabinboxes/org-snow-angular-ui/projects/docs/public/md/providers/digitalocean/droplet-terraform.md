## <a id="droplet"></a>Droplet

Droplets are virtual machines that anyone can setup in seconds. You can use droplets, either standalone or as part of a larger, cloud based infrastructure.


### <a id="getting-started"></a>Getting Started

First, configure your ["digitalocean token"](#steps-to-get-your-account-id)  and ["public-key"](#create-public-key) ["pulumi token"](#steps-to-create-pulumi-token) properly in Digitalocean and add the secrets to GitHub Actions.

Then create a GitHub Action to create a Droplet and add the Snow Monkeys reusable workflows as shown:

```yaml
name: Deploy nginx on DigitalOcean Droplet

on:
  workflow_dispatch:
  repository_dispatch:
    types: [ automation-test-event ]

jobs:

  checkout:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4


  # statefull Pulumi - size https://slugs.do-api.dev
  create-droplet-digitalocean:
    needs: checkout
    uses: snow-monkeys-modules/digital-ocean-pulumi-iac/.github/workflows/create-droplet.yml@main
    with:
      name: web-server
      region: SGP1
      size: s-1vcpu-1gb
      image: ubuntu-24-10-x64
      destroy: false
      enable-testing: true
    secrets:
      digitalocean-token: ${{ secrets.GLOBAL_DIGITALOCEAN_TOKEN }}
      public-key: "${{ secrets.SSH_PUBLIC_KEY }}"
      snow-github-token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      pulumi-token: ${{ secrets.GLOBAL_PULUMI_API_TOKEN }}
      snow-token: ${{ secrets.SNOW_TOKEN }}
    
  use-output-droplet-ip:
    needs: create-droplet-digitalocean
    runs-on: ubuntu-22.04
    steps:
      
      - name: print output droplet ip
        run: echo "Load balancer IP address is ${{ needs.create-droplet-digitalocean.outputs.droplet_ip }}"

      # checkout app repository
      - uses: actions/checkout@v4

      - name: Add SSH key
        if: ${{ needs.create-droplet-digitalocean.outputs.droplet_ip != '' }}
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_rsa
          echo "${{ secrets.SSH_PUBLIC_KEY }}" > ~/.ssh/id_rsa.pub
          chmod 700 ~/.ssh
          chmod 600 ~/.ssh/id_rsa
          chmod 644 ~/.ssh/id_rsa.pub
          eval $(ssh-agent -s)
          ssh-add ~/.ssh/id_rsa

      # Set up DigitalOcean CLI
      - name: Install doctl
        if: ${{ needs.create-droplet-digitalocean.outputs.droplet_ip != '' }}
        uses: digitalocean/action-doctl@v2
        with:
          token: ${{ secrets.GLOBAL_DIGITALOCEAN_TOKEN }}

      # if firewall is not set, we cannot connect thru SSH
      - name: Run SSH commands
        if: ${{ needs.create-droplet-digitalocean.outputs.droplet_ip != '' }}
        env:
          DIGITALOCEAN_TOKEN: ${{ secrets.GLOBAL_DIGITALOCEAN_TOKEN }}
        run: |
          sleep 5
          ssh -o "StrictHostKeyChecking no" root@${{ needs.create-droplet-digitalocean.outputs.droplet_ip }} "sudo apt-get update && sudo apt-get install -y nginx"
          sleep 15

     
  
  destroy-droplet-digitalocean:
    needs: use-output-droplet-ip
    uses: snow-monkeys-modules/digital-ocean-pulumi-iac/.github/workflows/create-droplet.yml@main
    with:
      name: web-server
      region: SGP1
      size: s-1vcpu-1gb
      image: ubuntu-24-10-x64
      destroy: true
      enable-testing: true
    secrets:
      digitalocean-token: ${{ secrets.GLOBAL_DIGITALOCEAN_TOKEN }}
      public-key: "${{ secrets.SSH_PUBLIC_KEY }}"
      snow-github-token: ${{ secrets.SNOW_GITHUB_TOKEN }}
      pulumi-token: ${{ secrets.GLOBAL_PULUMI_API_TOKEN }}
      snow-token: ${{ secrets.SNOW_TOKEN }}

```


### <a id="required-inputs"></a>Required inputs

- [`framework`](#required-inputs) (String) The framework is based the application. Available value: "react", "angular", "astro", "next.js".
- [`project-name`](#required-inputs) (String) Project name also used as application name for Cloudflare Pages.

### <a id="optional-inputs"></a>Optional inputs

- [`build-directory`](#optional-inputs) (String) The build directory in framework. Default: "dist"
- [`build-command`](#optional-inputs) (String) Build command to generate the distribution javascript bundle. Default: "npm run build"
- [`zone_id`](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs/resources/access_rule#zone_id-1) (String) The Zone ID to use for this endpoint. Mutually exclusive with the Account ID.

### <a id="secrets"></a>Secrets

- [`account-id`](#secrets) (String) Cloudflare account id.
- [`cloudflare-token`](#secrets) (String) Cloudflare API token with proper permissions.
- [`snow-token`](#secrets) (String) Cloudflare API token with proper permissions.

### <a id="outputs"></a>Outputs

- [`static_webpage_url`](#outputs) (String) url.


You can review your deployed statics web pages in Cloudflare dashboard workers-and-pages

#### <a id="steps-to-get-your-account-id"></a>Steps to get your account ID

1. **Log in** to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
    
2. On the **homepage**, you’ll see the account id in the dropdown menu next to your account.

![[accountid.png]]
    
3. Copy and paste into Github actions secrets.

#### <a id="create-public-key"></a>Create public key

1. Generate an SSH key pair if you do not already have one.
2. Add the public key to your DigitalOcean account.
3. Store the public key as the `SSH_PUBLIC_KEY` GitHub Actions secret.

#### <a id="steps-to-create-pulumi-token"></a>Steps to create Pulumi token

1. **Log in** to [Pulumi](https://app.pulumi.com/).
2. Open **Settings → Access tokens**.
3. Create a token and store it as the `GLOBAL_PULUMI_API_TOKEN` GitHub Actions secret.

#### <a id="steps-to-create-a-cloudflare-api-token"></a>Steps to create a Cloudflare API Token

1. **Log in** to your[Cloudflare Dashboard](https://dash.cloudflare.com/).
    
2. **Navigate to API Tokens**
    
    - Click on your profile icon (top-right corner).
        
    - Select **"Profile"**.
        
    - Go to the **"API Tokens"** tab.
        
3. **Create a New API Token** 
    
    - Click **"Create Token"**.
        
    - You can either:
        
        - Use a **predefined template** (for Cloudflare pages is required permission for Cloudflare Workers)
            
        - Create a **custom token**.
            
4. **Configure Token Permissions**
    
    - **For a Custom Token:**
        
        - Select the **specific resources**.
            
        - Define **permissions** (e.g., Read, Edit, Delete).
            
        - Restrict token access to specific zones if needed.
            
5. Set Token TTL **(Optional)**
    
    - You can set an expiration time (TTL) for the token if needed.
        
6. Define IP Address Filtering **(Optional)**
    
    - Restrict the token to specific IP addresses for security.
        
7. **Generate the Token**
    
    - Click **"Continue to summary"**.
        
    - Review permissions.
        
    - Click **"Create Token"**.
        
8. **Copy and Store the Token Securely**
    
    - The token will appear only once—**copy and save it securely**.
        
    - If lost, you’ll need to generate a new one.
    
9. **Copy and paste** into Github actions secrets.