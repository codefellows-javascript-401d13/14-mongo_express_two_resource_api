'use strict';

const Router = require('express').Router;
const debug = require('debug')('quiver:guitar-router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Quiver = require('../model/quiver.js');
const Guitar = require('../model/guitar.js');

const guitarRouter = module.exports = new Router();

guitarRouter.post('/api/quiver/:quiverID/guitar', jsonParser, function(req, res, next) {
  debug('POST: /api/quiver/:quiverID/guitar');

  req.body.timestamp = new Date();
  Quiver.findByIdAndAddGuitar(req.params.quiverID, req.body)
  .then( guitar => res.json(guitar))
  .catch( () => next(createError(400, 'bad request')));
});

guitarRouter.get('/api/quiver/:quiverID/guitar/:guitarID', function(req, res, next) {
  debug('GET: /api/quiver/:quiverID/guitar/:guitarID');

  try {
    Guitar.findById(req.params.guitarID)
    .then( guitar => res.json(guitar))
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, 'bad request'));
  }
});

guitarRouter.put('/api/quiver/:quiverID/guitar/:guitarID', jsonParser, function(req, res, next) {
  debug('PUT: /api/quiver/:quiverID/guitar/:guitarID');

  try {
    Guitar.findByIdAndUpdate(req.params.guitarID, req.params.body, {new: true})
    .then( guitar => res.json(guitar))
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, err.message));
  }
});

guitarRouter.delete('/api/quiver/:quiverID/guitar/:guitarID', function(req, res, next) {
  debug('DELETE: /api/quiver/:quiverID/guitar/:guitarID');

  try {
    Guitar.findByIdAndRemove(req.params.guitarID)
    .then( () => res.status(204).send('no content'))
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, err.message));
  }
});
