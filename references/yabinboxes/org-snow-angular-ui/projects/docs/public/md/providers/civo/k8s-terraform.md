## <a id="create-k8s-cluster"></a>Create K8s Cluster

This Module helps in create a Kubernetes cluster in civo. 

Configuration added:
- ArgoCD
- Ingress Controller with Traefik


### <a id="getting-started"></a>Getting Started

First, get your ["civo token"](#steps-to-get-civo-token) and add the secrets to GitHub Actions.

Then create a GitHub Action to create the static web deployment and add the Snow Monkeys reusable workflows as shown:

```yaml
name: Deploy static webpage in Cloudflare Pages

on:
  push:
    branches: [ "main" ]

jobs:
  deploy-static-webpage:
    uses: snow-monkeys-modules/cloudflare-static-website/.github/workflows/main.yml@main
    with:
      framework: react
      project-name: hello-react-vite
      build-directory: dist
      build-command: npm run build
    secrets:
      account-id: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      cloudflare-token: ${{ secrets.CLOUDFLARE_API_TOKEN_PAGES }}
      snow-token: ${{ secrets.SNOW_TOKEN }}

  use-output:
    needs: deploy-static-webpage
    runs-on: ubuntu-22.04
    steps:
     - name: Use output
       run: echo "Url is ${{ needs.deploy-static-webpage.outputs.static_webpage_url }}"


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

#### <a id="steps-to-get-civo-token"></a>Steps to get Civo token

1. **Log in** to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
    
2. On the **homepage**, you’ll see the account id in the dropdown menu next to your account.

![[accountid.png]]
    
3. Copy and paste into Github actions secrets.


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










