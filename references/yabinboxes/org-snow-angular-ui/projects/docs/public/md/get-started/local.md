# <a id="installation-docker-compose"></a>Installation (Docker Compose)

This guide shows how to install the service locally using Docker Compose.

## <a id="prerequisites"></a>Prerequisites

- Docker Desktop (or Docker Engine) installed and running
- Docker Compose v2 (included with Docker Desktop)

## <a id="1-create-a-docker-composeyml"></a>1) Create a `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:15
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
    ports:
      - 5438:5432
    volumes:
      - pgdata:/var/lib/postgresql/data 
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - snow-network

 
  quarkus-app:
    image: yabinm/snow-publish-quarkus:latest
    pull_policy: always
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    networks:
      - snow-network
  
  notification-service:
    image: yabinm/snow-websocket-bun:latest
    ports:
      - "3000:3000"
    depends_on:
      - quarkus-app
    networks:
      - snow-network
      
  web:
    image: yabinm/snow-ui-dashboard:latest
    pull_policy: always
    ports:
      - "4200:80"
    depends_on:
      - quarkus-app
    networks:
      - snow-network

  docs:
    image: yabinm/snow-ui-docs:latest
    pull_policy: always
    ports:
      - "4201:80"
    depends_on:
      - quarkus-app
    networks:
      - snow-network

volumes:
  pgdata:

networks:
  snow-network:
    driver: bridge
```

## <a id="2-start-the-service"></a>2) Start the service

```bash
docker compose up -d
```

## <a id="3-verify-it-is-running"></a>3) Verify it is running

```bash
docker compose ps
```

If the service exposes a health endpoint, you can test it:

```bash
curl http://snow-monkeys.com:8080/health
```

## <a id="4-stop-the-service"></a>4) Stop the service

```bash
docker compose down
```

## <a id="notes"></a>Notes

- Replace `your-org/snow-service:latest` with your actual image.
- If you need a different port, change both `ports` and `PORT`.