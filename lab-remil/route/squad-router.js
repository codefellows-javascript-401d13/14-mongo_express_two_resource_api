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
