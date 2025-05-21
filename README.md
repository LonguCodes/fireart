# Fireart

### Purpose

This repository is an execution of a recruitment task for FireartStudio
It implements a simple coffee inventory management api, along with sign up/sign in functionality and password reset

### Time frame

__Estimated__: 4-6h
__Actual__: ~11h

### Tech stack

- Nx - monorepo management
- NestJs - backend framework
- pg - database access (no ORM allowed)
- PostgreSQL - database
- Smtp4Dev - mock smtp server for mail testing


### Local setup

To run the backend service, the following 
- Node.js 24 or newer
- Docker

If you are using NixOs, you can set up your Node.js version using `nix develop` (nix flakes and nix command need to be enabled)

To bring up the docker containers, use `docker compose up -d`

To run the api, use `nx serve api`

### Decisions during development

- Use functional library - `typescript-functional-extensions` makes a lot of cases easier to write using its chaining functions, but it also makes it harder to join the project mid-way. 
- No ORM - this was a task requirements, but it turns out writing everything yourself is much harder than expected. Reimplementing database operations from scratch took considerable amount of work and made me overshoot the estimated timeframe.
- No rich domain layer - I chose `Transaction Script` as the method of implementation all the endpoints. This idea, combined with functional way of writing code really made the CRUD endpoints easy to read and maintain. Unfortunately the same is not true for the authentication endpoints, which turned out complicated and should be rewritten, probably using Domain Objects. This was not done due to time constraints.
- Usage on monorepo solution for single application - Even if monorepo management library was not so useful right now, adding new application right now is just a simple command away. Nx is not a heavy burden to maintain even without benefits, so to theoretical potential was greater than minimal overhead.