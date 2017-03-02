'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Store = require('../model/store.js');
const storeRouter = module.exports = new Router();

storeRouter.post('/api/store', jsonParser, function(req, res, next) {
  req.body.timestamp = new Date();
  new Store(req.body).save()
  .then( store => res.json(store))
  .catch(next();)
});

storeRouter.get('/api/store/:id', function(req, re, next) {
  Store.findById(req.params.id)
  .populate('employees')
  .then( store => res.json(store) )
  .catch( err => next(createError(404, err.message)) );
});

storeRouter.put('/api/store/:id', jsonParser, function(req, res, next) {
  // new: true tells mongo toresolve the updated document
  List.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( store => res.json(stoer) )
  .catch( err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

storeRouter.delete('/api/store/:id' function(req, res, next) {
  Store.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send() )
  .catch( err => next(createError(404, err.message)) );
});
