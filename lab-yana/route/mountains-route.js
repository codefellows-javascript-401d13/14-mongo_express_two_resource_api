'use strict';

const debug = require('debug')('peak:mountains-route');
const parseJSON = require('body-parser').json();
const Mountains = require('../model/mountains.js');
const Router = require('express').Router;
const createError = require('http-errors');

const mountainsRouter = module.exports = new Router();

mountainsRouter.get('/api/mountains/:id', function(req, res, next) { //retrieve apeak
  debug('GET: /api/mountains/:id');
  Mountains.findById(req.params.id)
    .populate('peaks') //this puts all the the peak bodies into the peaks array property of Mountains... I think
    .catch(next)
    .then(mountains => res.json(mountains)); //return the peak because it's a get method! they asked for it!
});

mountainsRouter.post('/api/mountains', parseJSON, function(req, res, next) { //create a new Mountains object
  debug('POST: /api/mountains');
  req.body.timestamp = new Date();
  new Mountains(req.body).save()
    .catch(next)
    .then(mountains => res.json(mountains));
});

mountainsRouter.put('/api/mountains/:id', parseJSON, function(req, res, next) { //updates info of a PEAK in Mountains
  debug('PUT: /api/mountains/:id');
  if (req._body !== true) var invalidBody = true;
  Mountains.findByIdAndUpdate(req.params.id, req.body, { new: true } )//new property determines whether the new info is displayed
  .then(peak => {
    if (invalidBody) return Promise.reject(createError(400, 'bad request'));
    res.json(peak);
  })
  .catch(next);
});

mountainsRouter.delete('/api/mountains/:id', function(req, res, next) { //removes Mountains
  debug('DELETE: /api/mountains/:id');
  Mountains.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch(next);
});
