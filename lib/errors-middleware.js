'use strict';

const createError = require('http-errors');
const debug = require('debug')('people:errors-middleware');

module.exports = function(err, req, res, next) {
  if(err.status) {

    res.status(err.status).send(err.name);
    next();
    return;
  }

  // debug('server error !');
  err = createError(500, err.message);
  res.status(err.status).send(err.name);
  next();
};
