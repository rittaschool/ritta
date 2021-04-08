<img src="https://ritta.pw/assets/img/logo.svg" alt="Ritta Logo" height="100">

Ritta is a system for schools to keep connection between home and school strong.

[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![GitHub last commit](https://img.shields.io/github/last-commit/rittaschool/ritta.svg?style=flat)]()
[![Twitter Follow](https://img.shields.io/twitter/follow/rittaschool.svg?style=social)](https://twitter.com/rittaschool)
[![Open Source](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/) \
Also visit our [webpage!](https://ritta.pw)

## Branches

> "release" - Mainly the current main code that seems to be somewhat stable \
> "development" - WIP code by Raikas, usually pretty unstable

## Our goals

We want to create a modern solution for nowday's standards. About 50% of **all** traffic is from mobile devices, and when talking about students, more and more do not have a access to a desktop computer. So, making a fast, secure, responsive and a modern solution for schools to strengthen the connection between home and school.
Later, a mobile app (probably will be made with [Flutter](https://flutter.dev)) will be also coded after the API and core features are done.

## Contributing

If you want to contribute, please contact project leader Raikas on Twitter (@raikasdev), Discord (Raikas#0178) or email [roni@raikas.xyz](mailto:roni@raikas.xyz).

## Installation

Ritta is currently in a very early stage, and installing is **NOT** recommended.
If you still want to test how's the prototypes going, download the sources and extract them.

Run following command in the folder to install `npm install`\
And start with `npm test`

You will need to create a .env file (or save them to environment directly) and supply the following values:
`MONGODB_CONNECTION_STRING=MongoDBConnectionStringHere`\
`ENCRYPTION_KEY=Random Encryption String. Never use something simple.`\
`SESSION_SECRET=Session secret, similar to encryption key but should be different.`


## Credits

Ritta's web interface is currently based on [Stisla](https://getstisla.com) template, to make the development easier as [I](https://github.com/raikasdev) am not a great front-end developer. Their credits can be found [here](https://demo.getstisla.com/credits.html) if you want to watch.

