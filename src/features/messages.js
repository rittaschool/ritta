const express = require('express');
const api = require('../api');

api.add('/messages', new express.Router());
