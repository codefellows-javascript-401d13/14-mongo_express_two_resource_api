'use strict';

const debug = require('debug')('streetz:squad');
const createError = require('http-errors');
const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;
const Schema = mongoose.Schema;
const Playa = require('./playa.js');

const squadSchema = Schema({
  squadName: { type: String, required: true },
  playas: [ { type: Schema.Types.ObjectId, ref: 'Playa'} ],
});

const Squad = module.exports = mongoose.model('Squad', squadSchema);

Squad.findByIdAndAddPlaya = function(id, playa) {
  debug('findByIdAndAddPlaya');

  return Squad.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( squad => {
    playa.squadID = squad._id;
    this.tempSquad = squad;
    return new Playa(playa).save();
  })
  .then( playa => {
    this.tempSquad.playas.push(playa._id);
    this.tempPlaya = playa;
    return this.tempSquad.save();
  })
  .then ( () => this.tempPlaya);
};
