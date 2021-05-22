const express = require('express');

const api = require('../api');
// const { app } = require('../web');
const database = require('../database');

// const webRouter = new express.Router();
const apiRouter = new express.Router();

// app.use('/settings', webRouter);
api.add('/settings', apiRouter);

apiRouter.post('/changePassword', async (req, res) => {
  if (
    !req.body.newPassword
    || !req.body.oldPassword
  ) {
    const error = new Error('Missing oldPassword or newPassword');
    error.code = 400;
    throw error;
  }
  const success = await database.setPassword(
    req.user.username,
    req.body.oldPassword,
    req.body.newPassword,
  );
  if (!success) {
    const error = new Error('Invalid password');
    error.code = 400;
    throw error;
  }
  res.redirect('/logout');
});
