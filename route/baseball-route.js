'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Card = require('../model/card.js');
const debug = require('debug')('card:baseball-route');

const baseballRouter = module.exports = new Router();

baseballRouter.post('/api/card/:cardId/baseball', jsonParser, function(req, res, next) {
  debug('POST: /api/card/:cardId/baseball');

  Card.findByIdAndAddBaseball(req.params.cardId, req.body)
  .then( baseball => res.json(baseball))
  .catch(next);
});
