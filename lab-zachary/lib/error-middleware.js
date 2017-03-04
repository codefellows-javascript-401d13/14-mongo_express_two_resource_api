'use strict';

const createError = require('http-errors');
const debug = require('debug')('bike:error-middleware');

module.exports = function(err, req, res, next){

  if (err.status){
    debug('user error', err.name);

    res.status(err.status).send(err.message);
    next();
    return;
  }
  if (err.name === 'ValidationError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.message);
    next();
    return;
  }

  debug('server error'); //last error handler in app - set generic 500

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};