const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Lot = require('../model/lot.js');

const carRouter = module.exports = new Router();

carRouter.post('/api/lot/:lotID/car', jsonParser, function(req, res, next) {
  Lot.findByIdAndAddCar(req.params.lotID, req.body)
  .then( car => res.json(car))
  .catch(next);
});
