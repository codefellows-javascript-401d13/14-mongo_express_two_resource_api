'use strict';
const
  createError = require('http-errors'),
  debug = require('debug')('employee:error-middleware');

module.exports = function(err, req, res){
  debug('err-middleware');
  
  if(err.status){
    res.status(err.status).send(err.message);
    return;
  }

  if(err.name === 'ValidationError'){
    err = createError(400, err.message);
    res.status(err.status).send(err.message);
    return;
  }

  err = createError(500, err.message);
  res.status(err.status).send(err.message);
};