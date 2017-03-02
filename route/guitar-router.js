'use strict';

const Router = require('express').Router;
const debug = require('debug')('quiver:guitar-router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();

const Quiver = require('../model/quiver.js');
const Guitar = require('../model/guitar.js');

const guitarRouter = module.exports = new Router();

guitarRouter.post('/api/list/:quiverID/guitar', jsonParser, function(req, res, next) {
  debug('POST: /api/list/:quiverID/guitar');

  req.body.timestamp = new Date();
  Quiver.findByIdAndAddGuitar(req.params.quiverID, req.body)
  .then( guitar => res.json(guitar))
  .catch( () => next(createError(400, 'bad request')));
});

guitarRouter.get('/api/list/:quiverID/guitar/:guitarID', function(req, res, next) {
  debug('GET: /api/list/:quiverID/guitar/:guitarID');

  try {
    Quiver.findByID(req.params.quiverID)
    .populate('guitars')
    .then( quiver => {
      quiver.guitars.forEach( g => {
        if(req.params.guitarID === g._id) res.json(g);
      });
    })
    .catch( () => next(createError(404, 'not found')));
  } catch (err) {
    next(createError(400, 'bad request'));
  }
});

guitarRouter.put('/api/list/:quiverID/guitar/:guitarID', jsonParser, function(req, res, next) {

  try {
    Quiver.findByID(req.params.quiverID)
    .populate('guitars')
    .then( quiver => {
      quiver.guitars.forEach( g => {
        if(req.params.guitarID === g._id) return g;
      })
    })
  }
})
