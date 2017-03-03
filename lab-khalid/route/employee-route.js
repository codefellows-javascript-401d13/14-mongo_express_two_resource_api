'use strict';

const
  Router = require('express').Router,
  jsonParser = require('body-parser').json(),
  Employee = require('../model/employee.js'),
  debug = require('debug')('employee:employee-route'),
  createError = require('http-errors');

const empRouter = module.exports = new Router();

empRouter.post('/api/employee', jsonParser, function(req,res, next){
  debug('empRouter post /api/employee');
  req.body.timestamp = new Date();
  new Employee(req.body).save()
  .then( employee => res.json(employee))
  .catch(next);
});

empRouter.get('/api/employee/:id', function(req, res, next){
  debug('empRouter get /api/employee/:id');
  Employee.findById(req.params.id)
  .populate('devs')
  .then(employee => res.json(employee))
  .catch(err => next(createError(404, err.message+'GITGITGRRRRA')));
});

empRouter.put('/api/employee/:id', jsonParser, function(req, res, next){
  debug('empRouter put /api/employee/:id');
  Employee.findByIdAndUpdate(req.params.id, req.body, {new :true})
  .then(employee => res.json(employee))
  .catch(err => {
    if(err.name === 'ValidationError') return next(err);
    next(createError(404, err.message));
  });
});

empRouter.delete('/api/employee/:id', function(req, res, next){
  debug('empRouter delete /api/employee');
  Employee.findByIdAndRemove(req.params.id)
  .then( () => res.status(200).send())
  .catch(err => next(createError(404, err.message)));
});

