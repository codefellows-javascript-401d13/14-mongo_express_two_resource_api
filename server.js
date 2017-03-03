'use strict';

const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('quiver:server');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const cors = require('cors');

const errors = require('./lib/error-middleware.js');
const quiverRouter = require('./route/quiver-router.js');
const guitarRouter = require('./route/guitar-router.js');

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test_app';
const PORT = process.env.PORT || 3000;

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(quiverRouter);
app.use(guitarRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Yo dude, my port is functioning: ${PORT}`);
});
