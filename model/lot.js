'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('car:lot');
const Schema = mongoose.Schema;

const Car = require('./car.js');

const lotSchema = Schema({
  name: { type: String, required: true },
  timestamp: { type: Date, required: true },
  cars: [{ type: Schema.Types.ObjectId, ref: 'car' }]
});

const Lot = module.exports= mongoose.model( 'lot', lotSchema);

Lot.findByIdAndAddCar = function(id, car) {
  debug('findByIdAndAddCar');

  return Lot.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( lot => {
    car.lotID = lot._id;
    this.tempLot = lot;
    return new Car(car).save();
  })
  .then( car => {
    this.tempLot.cars.push(car._id);
    this.tempCar = car;
    return this.tempLot.save();
  })
  .then( () => {
    return this.tempCar;
  });
};
