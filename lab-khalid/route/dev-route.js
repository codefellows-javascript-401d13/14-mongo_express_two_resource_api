'use strict';

const
  Router = require('express').Router,
  jsonParser = require('body-parser').json(),
  Employee = require('../model/employee.js'),
  debug = require('debug')('employee:dev-router');

const 
  devRouter = module.exports = new Router();

devRouter.post('/api/employee/:EID/dev', jsonParser, function(req,res, next){
  debug('devRouter post /api/employee/EID/dev');
  Employee.findByIdAndAddDev(req.params.EID, req.body)
  .then(dev => res.json(dev))
  .catch(next);
});