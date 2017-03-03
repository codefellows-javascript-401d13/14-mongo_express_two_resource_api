'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('people:server');

const peopleRouter = require('./route/people-route.js');
const presidentsRouter = require('./route/president-route.js');
const errors = require('./lib/errors-middleware.js');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/peopletest';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));
app.use(peopleRouter);
app.use(presidentsRouter);
app.use(errors);

app.listen(PORT, function() {
  // debug(`server up on: ${PORT}`);
});
