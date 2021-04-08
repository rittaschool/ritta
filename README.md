# Ritta/Application
Ritta is a system for schools to keep connection between home and school strong.

## Installation

Ritta is currently in a very early stage, and installing is not recommended.
If you still want to test how's the prototypes going, download the sources and extract them.

Run following command in the folder to install `npm install`\
And start with `npm test`

You will need to create a .env file (or save them to environment directly) and use the following template:
`MONGODB_CONNECTION_STRING=MongoDBConnectionStringHere
ENCRYPTION_KEY=Random Encryption String. Never use something simple.
SESSION_SECRET=Session secret, similar to encryption key but should be different.`


## Credits

Ritta's web interface is currently based on [Stisla](https://getstisla.com) template, to make the development easier as [I](https://github.com/raikasdev) am not a great front-end developer. Their credits can be found [here](https://demo.getstisla.com/credits.html) if you want to watch.

