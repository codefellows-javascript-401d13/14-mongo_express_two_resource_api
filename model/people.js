'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const debug = require('debug')('people:people');

const President = require('./president.js');

const peopleSchema = Schema({
  name: { type: String, required: true},
  timestamp: { type: Date, required: true},
  presidents: [{type: Schema.Types.ObjectId, ref: 'president'}]
});

mongoose.Promise = Promise;

const People = module.exports = mongoose.model('people', peopleSchema);

People.findByIdAndAddPresident = function(id, president) {


  return People.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( people => {
    president.peopleID = people._id;
    this.tempPeople = people;
    return new People(people).save();
  })
  .then( president => {
    this.tempPeople.presidents.push(president._id);
    this.tempPresident = president;
    return this.tempPeople.save();
  })
  .then( () => {
    return this.tempPresident;
  });
};
