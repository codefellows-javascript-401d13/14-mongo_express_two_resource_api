'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Card = require('../model/card.js');
const Baseball = require('../model/baseball.js');
const debug = require('debug')('card:baseball-route');
const createError = require('http-errors');

const baseballRouter = module.exports = new Router();

baseballRouter.post('/api/card/:cardId/baseball', jsonParser, function(req, res, next) {
  debug('POST: /api/card/:cardId/baseball');

  Card.findByIdAndAddBaseball(req.params.cardId, req.body)
  .then( baseball => res.json(baseball))
  .catch(next);
});

baseballRouter.get('/api/baseball/:id', function(req, res, next) {
  debug('GET: /api/baseball/:id');

  Baseball.findById(req.params.id)
  .then( baseball => res.json(baseball))
  .catch(err => next(createError(404, err.message)));
});

baseballRouter.put('/api/baseball/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/baseball/:id');

  Baseball.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( baseball => res.json(baseball))
  .catch(err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
