'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('quiver:quiver');
const createError = require('http-errors');

const Guitar = require('./guitar.js');

const quiverSchema = Schema({
  owner: { type: String, required: true},
  timestamp: { type: Date, required: true},
  guitars: [{ type: Schema.Types.ObjectId, ref: 'guitar'}]
});

const Quiver = module.exports = mongoose.model('quiver', quiverSchema);

Quiver.findByIdAndAddGuitar = function(id, _guitar) {
  debug('findByIdAndAddGuitar');

  return Quiver.findById(id)
  .catch( err => createError(404, err.message))
  .then( quiver => {
    _guitar.quiverID = quiver._id;
    _guitar.timestamp = new Date();
    this.tempQuiver = quiver;
    return new Guitar(_guitar).save();
  })
  .then( guitar => {
    this.tempGuitar = guitar;
    this.tempQuiver.guitars.push(guitar._id);
    return this.tempQuiver.save();
  })
  .then( () => {
    return this.tempGuitar;
  });
};
