'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const debug = require('debug')('card:server');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const cardRouter = require('./route/card-route.js');
const baseballRouter = require('./route/baseball-route.js');
const errors = require('./lib/error-middleware.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/baseballcarddb';

mongoose.Promise = Promise;
mongoose.use(MONGODB_URI);

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use(cardRouter);
app.use(baseballRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Server's up on port: ${PORT}`);
});
