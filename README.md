# <img src="https://raw.githubusercontent.com/rittaschool/info/master/Ritta.png" height="100px" alt="ritta-server" />

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/)
[![GitHub last commit](https://img.shields.io/github/last-commit/rittaschool/ritta-server.svg?color=orange&style=for-the-badge&logo=git)](https://github.com/rittaschool/ritta-server/commits/master)
[![Discord Channel](https://img.shields.io/discord/718870928498360463.svg?color=blue&style=for-the-badge&logo=discord)](https://discord.gg/KwpZGyvX3Q)

Hello, and thank you for showing interest in Ritta! 👋
We here at Ritta are creating new platforms to support the future of education.

We think current solutions aren't good enough for today's needs.
Current solutions available in Finland are old, difficult to use and not responsive. The education space changes every year, and new solutions are needed.

That's why we are creating Ritta.
Ritta is an open source student management system designed for making life easier.
Our team currently consists of four talented young developers and/or designers.

## How does Ritta work?

We are trying to use modern technologies and following best practices.
*(psst: from now on this will be pretty much technical stuff.)*

We use Microservice architecture provided by the [NestJS](https://nestjs.com) framework, which allows Ritta to be horizontally scalable.
For development and production we use Docker and docker-compose. For dependency management we use [Yarn](https://yarnpkg.com), especially Yarn Workspaces.
For client application development we provide REST and GraphQL APIs.

You also might be interested in our official frontend, [ritta-next](https://github.com/rittaschool/ritta-next).

## API Documentation

The instance specific API documentation can be viewed by going to `https://<ritta-server url>/docs` or to `https://api.demo.ritta.fi/docs` (most addons enabled).

## Bugs and suggestions

Found something or got an idea you would like to share? \
For minor bugs and suggestions use [issues](https://github.com/rittaschool/ritta-server/issues). \
For security problems and bigger bugs, please follow procedures in [`SECURITY.md`](https://github.com/rittaschool/ritta-server/blob/master/SECURITY.md)

## Running

For running Ritta you must have NodeJS, Yarn, Docker and docker-compose installed.
Easiest way to run Ritta then is to run `docker-compose up` in the root directory of the project.

## Official Development environment

The Ritta development environment is a docker-compose environment where your code is linked to the containers using volumes. \
For development, run `./scripts/start-docker.sh` to start with the development configuration. \
You can stop the containers with `./scripts/stop-docker.sh`. \
And if you want you can remove all of the networks and containers with `./scripts/remove-docker.sh`.

## Contributing

Contributions are always welcome!
See [`CONTRIBUTING.md`](https://github.com/rittaschool/ritta-server/blob/master/CONTRIBUTING.md) for how to contribute.

## Contact us

Contact us at [tuki@ritta.fi](mailto:tuki@ritta.fi) or alternatively on our Discord server (Link in the at the top)!
