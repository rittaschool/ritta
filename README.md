# <img src="https://raw.githubusercontent.com/rittaschool/info/master/Ritta.png" height="100px" alt="ritta-server" />

Ritta is a modern open source school management system for schools to keep connection between home and school strong.

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/)
[![GitHub last commit](https://img.shields.io/github/last-commit/rittaschool/ritta-server.svg?color=orange&style=for-the-badge&logo=git)](https://github.com/rittaschool/ritta-server/commits/master)
[![Discord Channel](https://img.shields.io/discord/718870928498360463.svg?color=blue&style=for-the-badge&logo=discord)](https://discord.gg/KwpZGyvX3Q)

## How does it work?

We use the **Microservices** architecture make Ritta very scalable and allow more flexibility. \
Ritta also is made of two core parts, ritta-server (that you are viewing right now) and the [ritta-next](https://github.com/rittaschool/ritta-next) (the frontend). \
We use modern technologies like [NestJS](https://nestjs.com) for the backend of Ritta to make development easier and faster!

## API Documentation

The API documentation can be seen by going to `https://<ritta-server url>/docs`

## Requirements

    - Docker
    - docker-compose

## Running the app

For developing you can just run `docker-compose -f docker-compose.dev.yml up` to start it with the development configuration.

## Contributing

Contributions are always welcome! \

See [`CONTRIBUTING.md`](https://github.com/rittaschool/ritta-server/blob/master/CONTRIBUTING.md) for how to contribute.

## Roadmap

We are currently working on the [1.1 Release "Frostbite"](https://github.com/rittaschool/ritta-server/milestone/1). \
It's due date is currently on January 1 of 2022, and it will contain the core features likes users, accounts, schools and messaging. \
It is not functional for school usage, but will be a good starting point for faster development for [1.1 release "Bitterheart"](https://github.com/rittaschool/ritta-server/milestone/2) that adds more functional features.

# But why?

We need good software, easy to use for the public, easy to integrate for the developers. \
Finland is the current primary market for Ritta, and here there isn't a open source solution for school management. There have been some projects, but they have in some or other way failed. But we here at Ritta are passionate what we do, and want to make open source software more used in the public sector.
Also we want to create good open source software for schools. Ritta is open source because we want to give the control to the schools, not the big companies. They can even create their own addons to Ritta so it will suit their need better, or better contribute the addon to the Ritta project. That's the beaty of open source.

## Contact us!

Contact us at [roni@ritta.fi](mailto:roni@ritta.fi) or join our Discord server (link in the badge above)!
