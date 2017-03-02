'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Library = require('../model/library.js');
const libraryRouter = module.exports = new Router();

libraryRouter.post('/api/library', jsonParser, function(req, res, next){
  req.body.timestamp = new Date();
  new Library(req.body).save()
  .then( library => res.json(library))
  .catch(next);
});

libraryRouter.get('/api/library/:id', function(req, res, next){
  Library.findById(req.params.id)
  .populate('journals')
  .then( library => res.json(library))
  .catch( err => next(createError(404, err.message)));
});

libraryRouter.put('/api/library/:id', jsonParser, function(req, res, next) {
  Library.findByIdAndUpdate(req.params.id, req.body, { new: true})
  .then( library => res.json(library))
  .catch( err => {
    if (err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

libraryRouter.delete('/api/library/:id', function(req, res, next){
  Library.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
