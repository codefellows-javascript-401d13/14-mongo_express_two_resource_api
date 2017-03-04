'use strict';

const Router = require('express').Router;
const debug = require('debug')('bike:bike-router');
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const Bike = require('../model/bike.js');
const Quiver = require('../model/quiver.js');

const bikeRouter = module.exports = new Router;


bikeRouter.get('/api/quiver/:quiverID/bike/:bikeID', (req, res, next) => {
  debug('bikeRouter GET route');

  Bike.findById(req.params.bikeID)
  .then(bike => {
    res.json(bike);
  })
  .catch(err => {
    if(err.kind === 'ObjectId' && err.name === 'CastError') return next(createError(404, 'ID not found'));
    next(err);
  });
});

bikeRouter.post('/api/quiver/:quiverID/bike', jsonParser, (req, res, next) => {
  debug('bikeRouter POST');
  if(!req.body.name) return(next(createError(400, 'Name required')));
  if(!req.body.description) return(next(createError(400, 'Description required')));
  Quiver.findByIdAndAddBike(req.params.quiverID, req.body)
  .then( bike => {
    res.json(bike);
  })
  .catch(next);
});

bikeRouter.put('/api/quiver/:quiverID/bike/:bikeID', jsonParser, (req, res, next) => {
  debug('bikeRouter PUT');
  if(!req.body.name) return(next(createError(400, 'Name required')));
  if(!req.body.description) return(next(createError(400, 'Description required')));
  Bike.findByIdAndUpdate(req.params.bikeID, req.body, {new:true})
  .then( bike => {
    res.json(bike);
  })
  .catch(next);
});

bikeRouter.delete('/api/quiver/:quiverID/bike/:bikeID', (req, res, next) => {
  debug('DELETE /api/quiver/:quiverID/bike/:bikeID');
  Bike.findByIdAndRemove(req.params.bikeID)
  .then( bike => {
    if(!bike) return next(createError(404, 'ID not found'));
    return Quiver.findById(req.params.quiverID);
  })
  .then( quiver => {
    console.log('------------------------',quiver);
    if(!quiver) return next(createError(404, 'Bike Quiver not found'));
    let tempQuiver = quiver;
    let bikeIndex = tempQuiver.bikes.indexOf(req.params.bikeID);
    tempQuiver.bikes.splice(bikeIndex, 1);
    return Quiver.findByIdAndUpdate(req.params.quiverID, tempQuiver, {new:true});
  })
  .then( quiver => {
    if(!quiver) return next(createError(500, 'Quiver not updated'));
    res.sendStatus(204);
  })
  .catch(err => {
    if(err.kind === 'ObjectId' && err.name === 'CastError') return next(createError(404, 'ID not found'));
  });
});

bikeRouter.delete('/api/bike/:bikeID', (req, res, next) => {
  debug('DELETE /api/bike/:bikeID scratch method');
  Bike.findByIdAndRemove(req.params.bikeID)
  .then( bike => {
    if(!bike) return next(createError(404, 'ID not found'));
    return Quiver.findById(bike.quiverID);
  })
  .then( quiver => {
    if(!quiver) return next(createError(404, 'Bike Quiver not found'));
    let tempQuiver = quiver;
    let bikeIndex = tempQuiver.bikes.indexOf(req.params.bikeID);
    tempQuiver.bikes.splice(bikeIndex, 1);
    return Quiver.findByIdAndUpdate(quiver._id, tempQuiver, {new:true});
  })
  .then( quiver => {
    if(!quiver) return next(createError(500, 'Quiver not updated'));
    res.sendStatus(204);
  })
  .catch(err => {
    if(err.kind === 'ObjectId' && err.name === 'CastError') return next(createError(404, 'ID not found'));
  });
});





