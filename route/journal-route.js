'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Library = require('../model/library.js');
const createError = require('http-errors');
const Journal = require('../model/journal.js');

const journalRouter = module.exports = new Router();

journalRouter.post('/api/library/:libraryID/journal', jsonParser, function(req, res, next){
  Library.findByIdAndAddJournal(req.params.libraryID, req.body)
  .then( journal => res.json(journal))
  .catch(err => next(createError(404, err.message)));
});

journalRouter.get('/api/library/journal', function(req, res, next){
  Journal.findById(req.params.id)
  .then(journal => res.json(journal))
  .catch(err => next(createError(404, err.message)));
});

// journalRouter.put('/api/library/journal', jsonParser, function(req, res, next){
//   Journal.findByIdAndUpdate(req.params.id, req.body, {new: true})
//   .then( library => res.json(library))
//   .catch( err => {
//     if(err.name === 'ValidationError') return next(err);
//   });
// });

journalRouter.delete('/api/library/journal', function(req, res, next){
  Library.findByIdAndRemoveJournal(req.params.id)
  .then(() => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
