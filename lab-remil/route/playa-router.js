'use strict';

const debug = require('debug')('streetz:playa-router');
// const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Squad = require('../model/squad.js');
const Playa = require('../model/playa.js');
const playaRouter = module.exports = new require('express').Router();

playaRouter.post('/api/squad/:squadID/playa', jsonParser, function(req, res, next) {
  debug('POST: /api/squad/:squadID/playa');

  Squad.findByIdAndAddPlaya(req.params.squadID, req.body)
  .then( playa => res.json(playa))
  .catch(next);
});

playaRouter.get('/api/playa/:id', function(req, res, next) {
  debug('GET: /api/playa/:id');

  Playa.findById(req.params.id)
  .then( playa => res.json(playa))
  .catch(next);
});

playaRouter.put('/api/playa/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/playa/:id');

  Playa.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( playa => res.json(playa))
  .catch(next);
});
