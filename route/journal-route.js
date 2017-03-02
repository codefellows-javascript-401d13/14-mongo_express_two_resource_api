'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const Library = require('../model/library.js');

const journalRouter = module.exports = new Router();

journalRouter.post('/api/library/:libraryID/journal', jsonParser, function(req, res, next){
  Library.findByIdAndAddJournal(req.params.libraryID, req.body)
  .then( journal => res.json(journal))
  .catch(next);
});
