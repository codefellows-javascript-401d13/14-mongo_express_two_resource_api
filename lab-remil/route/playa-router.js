'use strict';

const debug = require('debug')('streetz:playa-router');
// const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Squad = require('../model/squad.js');
const playaRouter = module.exports = new require('express').Router();

playaRouter.post('/api/squad/:squadID/playa', jsonParser, function(req, res, next) {
  debug('POST: /api/squad/:squadID/playa');

  Squad.findByIdAndAddPlaya(req.params.squadID, req.body)
  .then( playa => res.json(playa))
  .catch(next);
});
