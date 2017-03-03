'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');

const Platform = require('../model/platform.js');
const platformRouter = module.exports = new Router();

platformRouter.post('/api/platform', jsonParser, function(req, res, next) {
    req.body.timestamp = new Date();
    new Platform(req.body).save()
    .then( platform => res.json(platform))
    .catch(next);
});

platformRouter.get('/api/platform/:id', function(req, res, next) {
    Platform.findById(req.params.id)
    .populate('videogames')
    .then( platform => res.json(platform))
    .catch( err => next(createError(404, err.message)));
});

platformRouter.put('/api/platform/:id', jsonParser, function(req, res, next) {
    Platform.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then( platform => res.json(platform))
    .catch( err => {
        if (err.name === 'ValidationError') return next(err);
        next(createError(404, err.message));
    });
});

platformRouter.delete('/api/platform/:id', function(req, res, next) {
    Platform.findByIdAndRemove(req.params.id)
    .then( () => res.status(204).send())
    .catch( err => next(createError(404, err.message)));
});