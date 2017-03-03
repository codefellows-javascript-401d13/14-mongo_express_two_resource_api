'use strict';

const debug = require('debug')('peak:peak-route.js');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const Mountains = require('../model/mountains.js');
const Peak = require('../model/peak.js');
const createError = require('http-errors');


const peakRouter = module.exports = new Router();

peakRouter.post('/api/mountains/:mountainsID/peak', jsonParser, function(req, res, next) { //update existing peak info in Mountains
  debug('POST: /api/mountains/:mountainsID/peak');
  Mountains.findByIdAndAddPeak(req.params.mountainsID, req.body, { new: true } )
  .then(peak => res.json(peak))
  .catch(next);
});

peakRouter.get('/api/peak/:id', function(req, res, next) {
  debug('GET: /api/peak/:id');
  Peak.findById(req.params.id)
  .then(peak => res.json(peak))
  .catch(next);
});

peakRouter.delete('/api/peak/:id', function(req, res, next) {
  debug('DELETE: /api/peak/:id');
  Peak.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch(next);
});

peakRouter.put('/api/peak/:id', jsonParser, function(req, res, next) {
  debug('PUT: /api/peak/:id');
  Peak.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(peak => {
      if (req._body !== true) return Promise.reject(createError(400, 'bad request'));
      res.json(peak);
    })
    .catch(next);
});
