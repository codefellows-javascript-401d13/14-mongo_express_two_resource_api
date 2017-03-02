'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('journal:library');
const Schema = mongoose.Schema;

const Journal = require('./journal.js');

const librarySchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  journals: [{ type: Schema.Types.ObjectId, ref: 'journal' }]
});

const Library = module.exports = mongoose.model('library', librarySchema);

Library.findByIdAndAddJournal = function(id, journal) {
  debug('findByIdAndAddJournal');

  return Library.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( library => {
    journal.libraryID = library._id;
    this.tempLibrary = library;
    return new Journal(journal).save();
  })
  .then( journal => {
    this.tempLibrary.journals.push(journal._id);
    this.tempJournal = journal;
    return this.tempLibrary.save();
  })
  .then( () => {
    return this.tempJournal;
  });
};
