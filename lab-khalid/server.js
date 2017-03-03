'use strict';

const
  express = require('express'),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  cors = require('cors'),
  Promise = require('bluebird'),
  debug = require('debug')('employee:server');

const
  employeeRouter = require('./route/employee-route.js'),
  devRouter = require('./route/dev-route.js'),
  errors = require('./lib/error-middleware.js');
  
const
  app = express(),
  PORT = process.env.PORT || 3000,
  MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/employee';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(devRouter);
app.use(employeeRouter);
app.use(errors);


app.listen(PORT, () => debug('SERVER UP AT ', PORT));