'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const People = require('../model/people.js');
const debug = require('debug')('people:president-route');

const presidentRouter = module.exports = new Router();

presidentRouter.post('/api/people/:peopleID/president', jsonParser, function(req, res, next) {
  People.findByIdAndAddPresident(req.params.peopleID, req.body)
  .then( president => res.json(president))
  .catch(next);
});

presidentRouter.get('/api/president/:id', function(req, res, next) {
  President.findById(req.params.id)
  .then( president => res.json(president))
  .catch( err => next(createError(404, err.message)));
})
