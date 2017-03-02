'use strict';

const Router = require('express').Router;
const debug = require('debug')('card:card-route');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Card = require('../model/card.js');
const cardRouter = module.exports = new Router();

cardRouter.post('/api/card', jsonParser, function(req, res, next) {
  debug('POST /api/card');

  new Card(req.body).save()
  .then( card => res.json(card))
  .catch(next);
});
