'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const Promise = require('bluebird');
const debug = require('debug')('journal:server');

const libraryRouter = require('./route/library-route.js');
const journalRouter = require('./route/journal-route.js');
const errors = require('./lib/error-middleware.js');


const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/journaldb';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(libraryRouter);
app.use(journalRouter);
app.use(errors);


app.listen(PORT, () => {
  debug(`server is up: ${PORT}`);
});
