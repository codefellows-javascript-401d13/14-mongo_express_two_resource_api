const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Lot = require('../model/lot.js');
const Car = require('../model/car.js');
const debug = require('debug')('car:car-router');
const carRouter = module.exports = new Router();

carRouter.post('/api/lot/:lotID/car', jsonParser, function(req, res, next) {
  debug('POST: api/lot/:lotID/car');

  Lot.findByIdAndAddCar(req.params.lotID, req.body)
  .then( car => res.json(car))
  .catch(next);
});

carRouter.get('/api/car/:id', function(req, res, next){
  debug('GET: /api/car/:id');

  Car.findById(req.params.id)
  .then( car => res.json(car))
  .catch( err => next(createError(404, err.message)));
});

carRouter.put('/api/car/:id', jsonParser, function(req, res, next){
  debug('PUT: /api/car/:id');

  Car.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( car => res.json(car))
  .catch( err => {
    if ( err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});
