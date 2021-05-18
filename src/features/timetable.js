const utils = require('../utils');
const api = require('../api');
const { Router } = require('express');

const apiRouter = new Router();

apiRouter.get('/get/:userid', (req, res) => {
  const value = utils.createCalendar([{
    title: 'Saksa',
    start: [2020, 10, 12, 22, 15],
    duration: { minutes: 45 },
  },
  {
    title: 'Englanti',
    start: [2020, 10, 12, 21, 15],
    duration: { minutes: 45 },
  }]);
  if (!value) {
    const error = new Error('Error while creating calendar.');
    error.code = 500;
    throw error;
  }
  res.writeHead(200, { 'Content-Type': 'application/force-download', 'Content-disposition': 'attachment; filename=calendar.ics' });
  res.end(value);
});

api.add('/timetable', apiRouter);
