'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const Promise = require('bluebird');
const debug = require('debug')('videogame:server');

const platformRouter = require('./route/platform-route.js');
const videogameRouter = require('./route/videogame-route.js');
const errors = require('./lib/error-middleware.js');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/videogame';

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const app = express();
app.use(cors());
app.use(morgan('dev'));

app.use(platformRouter);
app.use(videogameRouter);
app.use(errors);

app.listen(PORT, () => {
    debug(`server up: ${PORT}`);
});