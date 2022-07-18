<div align="center">
  <img src="https://raw.githubusercontent.com/rittaschool/info/master/Ritta.png" height="100px" alt="ritta-server" />
  
## Modern and easy to use school information system

Strengthening home-school communication and simplifying everyday school life

[![AGPLv3 License](https://img.shields.io/badge/License-AGPL%20v3-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/)
[![GitHub last commit](https://img.shields.io/github/last-commit/rittaschool/ritta-server.svg?color=orange&style=for-the-badge&logo=git)](https://github.com/rittaschool/ritta-server/commits/master)
[![Discord Channel](https://img.shields.io/discord/718870928498360463.svg?color=blue&style=for-the-badge&logo=discord)](https://discord.gg/KwpZGyvX3Q) \
 [![Tests](https://github.com/rittaschool/ritta-server/actions/workflows/testing-workflow.yml/badge.svg)](https://github.com/rittaschool/ritta-server/actions/workflows/testing-workflow.yml)
[![Docker](https://github.com/rittaschool/ritta-server/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/rittaschool/ritta-server/actions/workflows/docker-publish.yml)

</div>
  
Ritta is a modular student information system developed using modern technologies. With Ritta schools can communicate to parents and students easily and have one place where to find information, eg. exams, grades, schedules and room & device reservations.

Current solutions available in Finland are old, difficult to use and don't adapt easily to special needs. The education space changes every year, and new solutions are needed. Ritta plans to integrate to existing ecosystems (Moodle, Google Workspace, [DigiOne](https://digione.fi)), but also create it's own for schools that aren't part of a existing ecosystem, but still want to easily integrate to other systems.

## Getting started

For running Ritta you must have NodeJS **16**, Yarn **Classic**, Docker and docker-compose installed.

### Starting dependencies (RabbitMQ, databases)

Easiest way to start the dependencies is to run `environments/local/start-docker.sh` in the root of the project.

### Building and running Ritta

First, install the dependencies by running `yarn install`.
Then, you can start the project by opening a shell in each of the directories in the `apps` directory, and then run the `yarn start:dev` command, or the `yarn dev` for the frontend.
Alternatively, you can run `npx turbo run start:dev` to start the backend, and go then start the frontend by going to `apps/web` and running `yarn dev`.

## Architecture

We use Microservice architecture and the [NestJS](https://nestjs.com) framework for the backend, and for databases we primarily use MongoDB. Other databases may be used for specific microservices.
We are going to use [Novu](https://novu.co) for notification management and [PostHog](https://posthog.com) for product analytics in the future.
Our frontend is built using [Vite](https://vitejs.dev) and [Mantine](https://mantine.dev).
For dependency management we use [Yarn](https://yarnpkg.com) with Yarn Workspaces.
We provide REST and GraphQL APIs for developers.

## API Documentation

API documentation can be viewed by going to `https://<ritta-server url>/docs`.

## Bugs and suggestions

Found something or got an idea you would like to share? \
For minor bugs and suggestions use [issues](https://github.com/rittaschool/ritta-server/issues). \
For security problems and bigger bugs, please follow procedures in [`SECURITY.md`](https://github.com/rittaschool/ritta-server/blob/master/SECURITY.md)

## Contributing

Contributions are always welcome!
See [`CONTRIBUTING.md`](https://github.com/rittaschool/ritta-server/blob/master/CONTRIBUTING.md) for how to contribute.

## Contact us

Contact us at [tuki@ritta.fi](mailto:tuki@ritta.fi) or alternatively on our Discord server (Link in the at the top)!
