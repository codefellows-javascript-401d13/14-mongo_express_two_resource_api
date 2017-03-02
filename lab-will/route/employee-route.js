'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Store = require('../model/store.js');

const employeeRouter = module.exports = new Router();

employeeRouter.post('/api/store/:storeID/employee', jsonParser, function(req, res, next) {
  Store.findByIdAndAddEmployee(req.params.storeID, req.body)
  .then( employee => res.json(employee))
  .catch(next);
});
