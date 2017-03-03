'use strict';

const debug = require('debug')('streetz:squad-router');
// const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const squadRouter = module.exports = new require('express').Router();
const Squad = require('../model/squad.js');

squadRouter.post('/api/squad', jsonParser, function(req, res, next) {
  debug('POST: /api/squad');

  Squad(req.body).save()
  .then( squad => res.json(squad))
  .catch(next);
});

squadRouter.get('/api/squad/:id', function(req, res, next) {
  debug('GET: /api/squad');

  Squad.findById(req.params.id)
  .populate('playas')
  .then( squad => res.json(squad))
  .catch(next);
});

squadRouter.put('/api/squad/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/squad');

  Squad.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( squad => res.json(squad))
  .catch(next);
});
