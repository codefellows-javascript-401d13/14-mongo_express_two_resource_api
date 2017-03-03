'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Platform = require('../model/platform.js');

const videogameRouter = module.exports = new Router();

videogameRouter.post('/api/platform/:platformID/videogame', jsonParser, function(req, res, next) {
    Platform.findByIdAndAddVideogame(req.params.platformID, req.body)
    .then( videogame => res.json(videogame))
    .catch(next);
});