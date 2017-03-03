'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('quiver:quiver-router');
const jsonParser = require('body-parser').json();

const Quiver = require('../model/quiver.js');
const quiverRouter = module.exports = new Router();

quiverRouter.post('/api/quiver', jsonParser, function(req, res, next) {
  debug('POST: /api/quiver');

  req.body.timestamp = new Date();
  new Quiver(req.body).save()
  .then( quiver => res.json(quiver))
  .catch( () => next(createError(400, 'bad request')));
});

quiverRouter.get('/api/quiver/:id', function(req, res, next) {
  debug('GET: /api/quiver/:id');
  
  try {
    Quiver.findById(req.params.id)
    .populate('guitars')
    .then( quiver => res.json(quiver))
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, err.message));
  }
});

quiverRouter.put('/api/quiver/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/quiver/:id');

  try {
    Quiver.findByIdAndUpdate(req.params.id, req.body, { new: true})
    .then( quiver => res.json(quiver))
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, err.message));
  }
});

quiverRouter.delete('/api/quiver/:id', function(req, res, next) {
  debug('DELETE: /api/quiver/:id');

  try {
    Quiver.findByIdAndRemove(req.params.id)
    .then( () => res.status(204).send('no content'))
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, err.message));
  }
});
