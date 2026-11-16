# 6. Hands-on Reusable Workflows

> Status: written (pointer). Dashboard rows come from `snow-iac` notify after a caller job.

Run Chapter 5, Listing 5.2. Snow records a CLUSTER named `server-stateless` at `server_ip`. Run Listing 5.5 with `host: server-stateless` and the dashboard gains an APPLICATION.

| Listing | Snow kind |
| --- | --- |
| 5.2 `hcloud_server` | CLUSTER |
| 5.3 `hcloud_firewall` | RESOURCE |
| 5.4 `docker_compose` | SERVICE |
| 5.5 `docker_compose_app` | APPLICATION |

```text
Output
CLUSTER server-stateless  203.0.113.10
APPLICATION growing-gravity  203.0.113.10
```

Callers: [Chapter 5](../chapter-05-reusable-workflows/06-hands-on-reusable-workflows/).
