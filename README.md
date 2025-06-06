# NeoStyle Demo Banking App

This repository contains a demo banking application inspired by Neo Financial's customer portal. It follows a microservice architecture with GraphQL APIs.

**Services**:
- `auth-service`
- `accounts-service`
- `rewards-service`
- `transfers-service`

Each service is written in TypeScript using `graphql-yoga` and exposes a public GraphQL endpoint.

A `docker-compose.yml` file is provided for local development with MongoDB instances for dev and test environments.

Run `npm install` in each service directory and start the stack with `docker-compose up`.
