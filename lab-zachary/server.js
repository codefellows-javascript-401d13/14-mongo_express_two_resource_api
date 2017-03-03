'use strict';

const express = require('express');
const debug = require('debug')('bike:server');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');

mongoose.Promise = Promise;

const errors = require('./lib/error-middleware.js');
const bikeRouter = require('./route/bike-router.js');
const quiverRouter = require('./route/quiver-router.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/quiverdb';

mongoose.connect(MONGODB_URI);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(bikeRouter);
app.use(quiverRouter);
app.use(errors);

app.listen(PORT, () => debug('server up', PORT));
