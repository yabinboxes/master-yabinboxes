0. Docker, Cloudflare
1. Setup Firebase Service Account in mac mini
2. Access folder snow-postgresdb-docker-compose and run daemon postgres db
   > docker compose up -d
3. Copy snow-angular-ui-firebase-adminsdk-fbsvc-73950f4e06 to properties in snow-publish-java
4. Run snow-publish-java in local
5. Access folder snow-angular-ui and run daemon dashboard and docs ui
   > docker compose up -d
6. Run Cloudflare tunnels
   > cloudflared tunnel -url http://localhost:8080 
   > cloudflared tunnel -url http://localhost:4200 
   > cloudflared tunnel -url http://localhost:4201 
7. Done