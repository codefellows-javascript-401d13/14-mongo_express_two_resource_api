'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const Promise = require('bluebird');
const debug = require('debug')('employee:server');

const storeRouter = require('./route/store-route.js');
const employeeRouter = require('./route/employee-route.js');
const errors = require('./lib/error-middleware.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/employee';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use(storeRouter);
app.use(employeeRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});
