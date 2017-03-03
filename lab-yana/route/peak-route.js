'use strict';

const debug = require('debug')('peak:peak-route.js');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const Mountains = require('../model/mountains.js');


const peakRouter = module.exports = new Router();

peakRouter.post('/api/mountains/:mountainsID/peak', jsonParser, function(req, res, next) { //update existing peak info in Mountains
  debug('POST: /api/mountains/:mountainsID/peak');
  Mountains.findByIdAndAddPeak(req.params.mountainsID, req.body, { new: true } )
  .then(peak => res.json(peak))
  .catch(next);
});
