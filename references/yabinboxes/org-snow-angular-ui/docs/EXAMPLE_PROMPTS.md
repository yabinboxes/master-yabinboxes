1.  Prompt Input: Create a Hetzner server using snow-monkeys, with requirements: type: server, name: snow-server, server_type: "cx23", image: "ubuntu-22.04", location: "hel1".
    Output: ip server

2.  Prompt Input: Create a postgres db using snow-monkeys in hetzner using docker compose, with requirements: user -> admin, password -> password.
    Output: db connection

3.  Prompt Input: Create a java application using spring boot and snow-monkeys using docker compose in Hetzner server, with requirements:
    Output: url
        - get api with health check post api with user info in json format and write info to db. get db connection from snow-monkeys address tables.
        - implement get api that return users from db connection.

4.  Prompt Input: Implement Dev and Prod environment for Hetzner server
    Output: ip server

5.  Prompt Input: Implement Dev and Prod environment for Postgress db in docker compose
    Output: db connection

6.  Prompt Input: Implement Dev and Prod environment for Java application in docker compose
    Output: url

7.  Validate liveness for all the iac resources create using snow-monkeys
    Output: health checks