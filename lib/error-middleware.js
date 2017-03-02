'use strict';

const createError = require('http-errors');
const debug = require('debug')('car:error-middleware');

module.exports = function(err, req, res, next) {
  debug('error-middleware');

  console.console.error('msg:', err.message);
  console.error('name:', err.name);

  if (err.status){
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if (err.name === 'ValidtionError'){
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
