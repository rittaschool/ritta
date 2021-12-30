# <img src="https://raw.githubusercontent.com/rittaschool/info/master/Ritta.png" height="100px" alt="ritta-server" />

<a href="https://ritta.fi">Ritta</a> is a modern open source school management system to hold the connection between home and school strong.

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/)
[![GitHub last commit](https://img.shields.io/github/last-commit/rittaschool/ritta-server.svg?color=orange&style=for-the-badge&logo=git)](https://github.com/rittaschool/ritta-server/commits/master)
[![Discord Channel](https://img.shields.io/discord/718870928498360463.svg?color=blue&style=for-the-badge&logo=discord)](https://discord.gg/KwpZGyvX3Q)

## How does it work?

We use the **Microservices** architecture to make Ritta very scalable and allow more flexibility, and technologies like [NestJS](https://nestjs.com) in order to make development faster.

Ritta is made of two core parts, backend (ritta-server, which is this repository.) and the frontend [ritta-next](https://github.com/rittaschool/ritta-next).

## API Documentation

The API documentation can be viewed by going to `https://<ritta-server url>/docs`.

## Requirements

    - Docker
    - docker-compose

## Running the app

For development, run `docker-compose -f docker-compose.dev.yml up` to start with the development configuration.

## Bugs and suggestions

Found something or got an idea you would like to share? \
For minor bugs and suggestions use [issues](https://github.com/rittaschool/ritta-server/issues). \
For security problems and bigger bugs, please follow procedures in [`SECURITY.md`](https://github.com/rittaschool/ritta-server/blob/master/SECURITY.md)

## Contributing

Contributions are always welcome!
See [`CONTRIBUTING.md`](https://github.com/rittaschool/ritta-server/blob/master/CONTRIBUTING.md) for how to contribute.

## Roadmap

We are currently working on the [1.0 Release "Frostbite"](https://github.com/rittaschool/ritta-server/milestone/1). 
It's release date is currently on January 1. 2022 and it will contain the core features like accounts, schools and messaging. 

It is not functional for school usage yet, but will be a good starting point for [1.1 Release "Bitterheart"](https://github.com/rittaschool/ritta-server/milestone/2), which adds more functionality.

# Why?

We need efficient and easy to use software for the public that is easy to develop. 

Finland is the current primary market for Ritta, because in Finland there isn't an open source solution for school management. 
There have been some, but they have failed in some way. 

We here at Ritta are passionate what we do, we want to make open source software more used in the public sector.

Ritta is open source because we want to hand the control to the schools and not to the big companies. With this model they can even create their own add-ons to, so it will suit their needs better. That's the beauty of open source software.

## Contact us!

Contact us at [roni@ritta.fi](mailto:roni@ritta.fi) or alternatively on our Discord server (Link in the at the top)!
