'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const debug = require('debug')('bike:model/quiver');
const createError = require('http-errors');

const Bike = require('./bike.js');

const quiverSchema = new Schema({
  title: {type: String, required: true},
  timestamp: {type: Date, required:true},
  bikes: [{type: Schema.Types.ObjectId, ref: 'bike'}]
});

const Quiver = module.exports = mongoose.model('quiver', quiverSchema);


Quiver.findByIdAndAddBike = function(id, _bike){
  debug('findByIdAndAddBike');

  return Quiver.findById(id)
  .then( quiver => { //add a quiver ID a new bike
    _bike.quiverID = quiver._id;
    this.tempQuiver = quiver;
    return new Bike(_bike).save();
  }) //add the new bike ID to the quiver
  .then( bike => {
    this.tempQuiver.bikes.push(bike._id);
    this.tempBike = bike;
    return this.tempQuiver.save();
  })
  .then( () => {
    return this.tempBike;
  })
  .catch ( err => Promise.reject(createError(400, err.message)));
};


