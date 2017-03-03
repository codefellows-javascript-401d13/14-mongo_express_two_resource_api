'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('car:lot-router');
const Lot = require('../model/lot.js');
const lotRouter = module.exports = new Router();

lotRouter.post('/api/lot', jsonParser, function(req, res, next) {
  
  req.body.timestamp = new Date();
  new Lot(req.body).save()
  .then( lot => res.json(lot))
  .catch(next);
});

lotRouter.get('/api/lot/:id', function(req, res, next) {
  Lot.findById(req.params.id)
  .populate('cars')
  .then( lot => res.json(lot))
  .catch( err => next(createError(404, err.message)));
});

lotRouter.put('/api/lot/:id', jsonParser, function(req, res, next){
  Lot.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( lot => res.json(lot))
  .catch( err => {
    if ( err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

lotRouter.delete('/api/lot/:id', function(req, res, next) {
  Lot.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
