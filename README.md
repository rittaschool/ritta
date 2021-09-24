<!-- Hello! Welcome to the sources of the Ritta readme, woo! -->
<img src="https://github.com/rittaschool/info/raw/master/Ritta.png" alt="Ritta Logo" height="100">

Ritta is a modern system for schools to keep connection between home and school strong.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![GitHub last commit](https://img.shields.io/github/last-commit/rittaschool/ritta.svg?style=flat)]()
[![Twitter Follow](https://img.shields.io/twitter/follow/rittasoft.svg?style=social)](https://twitter.com/rittasoft)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/) \
Also visit our [webpage!](https://ritta.fi/jarjestelma)

## Branches

> "release" - Mainly the current main code that has been proven to be pretty stable \
> "development" - Development branch of @raikasdev, latest indev code.
> "v2" - Abandoned protype for a version 2

## Our goals

We want to create a modern solution for nowday's standards. About 50% of **all** traffic is from mobile devices, and when talking about students, more and more do not have a access to a desktop computer. So, making a fast, secure, responsive and a modern solution for schools to strengthen the connection between home and school.
Later, a mobile app (probably will be made with [Flutter](https://flutter.dev)) will be also coded after the API and core features are done.

# Stargazers

[![Stargazers repo roster for @rittaschool/ritta-server](https://reporoster.com/stars/dark/notext/rittaschool/ritta-server)](https://github.com/rittaschool/ritta-server/stargazers)

# Folder structure

src = Source code \
│ app.js = App entry point \
└───api = Fastify route plugins for all the endpoints of the app \
└───config = Environment variables and configuration related stuff \
└───loaders = Startup process modules \
└───models = Database models \
└───services = All the business logic \

## What/how?

We use TypeScript for programming, NodeJS for the runtime, MongoDB (with mongoose) as the database and Fastify as the web server. We are planning to add GraphQL support soon.
We also do testing using Jest, as it has some level of support for ES6 TypeScript.
We highly recommend to using nginx or other something else on top of Ritta as a reverse proxy.

## Contributing

If you want to contribute, please contact project leader Raikas first on Twitter (@raikasdev), Discord (Raikas#0178) or email [roni@raikas.xyz](mailto:roni@raikas.xyz).

# On the right side?

You can report security vulnerabilities on **huntr.dev** \
[![huntr](https://cdn.huntr.dev/huntr_security_badge_mono.svg)](https://huntr.dev)
