'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const debug = require('debug')('card:server');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.listen(PORT, () => {
  debug(`Server's up on port: ${PORT}`);
});
