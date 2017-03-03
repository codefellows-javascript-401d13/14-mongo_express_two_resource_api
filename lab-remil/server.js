'use strict';
'use strict';

const debug = require('debug')('streetz:server');
const Promise = require('bluebird');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const errors = require('./lib/error-middleware');
const squadRouter = require('./route/squad-router.js');
const playaRouter = require('./route/playa-router.js');

mongoose.Promise = Promise;
const app = require('express')();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/streetzdbdev';
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(squadRouter);
app.use(playaRouter);

app.use(errors);

app.listen(PORT, () => debug(`Servin' it up on >>> ${PORT} <<<`));
