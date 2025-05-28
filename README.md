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
- Usage on monorepo solution for single application - Even if monorepo management library was not so useful right now, adding new application right now is just a simple command away. Nx is not a heavy burden to maintain even without benefits, so to theoretical potential was greater than minimal overhead.


### Usage

All information about the api can be found on the /api endpoint (Swagger)

#### Authentication

All endpoints expect `/auth/**` need authentication. To authenticate, provide `Authorization` header with `Bearer <YOUR TOKEN>` as a value