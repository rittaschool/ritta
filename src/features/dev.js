// This is for development and debugging.
const express = require('express');

const { isAllowedToAccess } = require('../web');
const api = require('../api');

const router = new express.Router();

api.add('/dev', router);

// Development purposes, will be removed in 1.0
router.post('/eval', isAllowedToAccess([100]), (req, res) => {
  if (!req.body.command) {
    return res.status(400).json({ response: '', error: true });
  }
  // eslint-disable-next-line no-eval
  try {
    res.json({ response: eval(req.body.command), error: false });
  } catch (e) {
    return res.status(500).json({ response: e, error: true });
  }
});
