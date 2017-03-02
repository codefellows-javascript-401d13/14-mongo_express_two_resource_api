'use strict';

const debug = require('debug')('peak:error-middleware');
const createError = require('http-errors');

module.exports = function() {
  console.error(`msg: ${err.message}`);
  console.error(`name: ${err.name}`);

  if (err.status) { //if the error came with a status code, do this
    res.status(err.status).send(err.message);
    next();
    return;
  }

  if (err.name === 'ValidationError') { //if the error is a mongoose ValidationError, create a code 400 since it is due to an invalid/noneexistent req.body
    err = createError(400, err.message);
    res.status(err.status).send(err.message);
    next();
    return;
  }

  if(err.name === 'CastError') { //if the error is a mongoose CastError, create a 404 since that means the id was not found
    err = createError(404, err.message);
    res.status(err.status).send(err.message);
    next();
    return; //exit function so you don't hit the internal server error code below
  }

  err = createError(500, err.message); //if we don't hit any of the above, send a 500 internal server error to signify that we don't know what the fuck is wrong
  res.status(err.status).send(err.message);
}
