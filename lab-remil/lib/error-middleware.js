'use strict';

const debug = require('debug')('streetz:error-middleware');
const createError = require('http-errors');

module.exports = function(err, req, res, next) {
  debug('error middleware');

  if (err.status) {
    debug('user error');
    res.status(err.status).send(`${err.name}: ${err.message}`);
    next();
    return;
  }

  debug('server error');
  err = createError(500, err.message);
  res.status(err.status).send(`${err.name}: ${err.message}`);
  next();
};
