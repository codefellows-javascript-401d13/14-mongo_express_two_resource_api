'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const People = require('../model/people.js');
const peopleRouter = module.exports = new Router();
const debug = require('debug')('people:people-route');

peopleRouter.post('/api/people', jsonParser, function(req, res, next) {
  req.body.timestamp = new Date();
  new People(req.body).save()
  .then(people => res.json(people))
  .catch( err => next(err));
});

peopleRouter.get('/api/people/:id', function(req, res, next) {
  People.findById(req.params.id)
  .populate('president')
  .then(people => res.json(people))
  .catch( err => next(createError(404, err.message)));
});

peopleRouter.get('/api/people/', function(req, res, next) {
  People.findById()
  .then(people => res.json(people))
  .catch( err => next(err));
});

peopleRouter.put('/api/people/:id', jsonParser, function(req, res, next) {
  People.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(people => res.json(people))
    .catch( err => {
      if(err.name === 'ValidationError') return next(err);
      next(createError(404, err.message));
    });
});

peopleRouter.delete('/api/people/:id', function(req, res, next) {
  People.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(err));
});
