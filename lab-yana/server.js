'use strict';

const express = require('express');
const cors = require('cors');
const debug = require('debug')('peak:server');
const morgan = require('morgan');
const Promise = require('bluebird');
const mongoose = require('mongoose');
const errors = require('./lib/error-middleware.js');
// const mountainsRouter = require('./route/mountains-route.js');
// const peakRouter = require('./route/peak-route,js');
const PORT = 3003;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/peakapp';


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();

app.use(cors()); //make sure to CALL cors!!!
app.use(morgan('dev'));
// app.use(mountainsRouter);
// app.use(peakRouter);
app.use(errors);

app.listen(PORT, () => debug(`listening on port ${PORT}`));
