'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('people-president');
const Schema = mongoose.Schema;

const People = require('./people.js');

const presidentSchema = Schema({
  name: {type: String, required: true},
  age: {type: String, required: true},
  peopleID: {type: Schema.Types.ObjectId, req: true}
});

module.exports = mongoose.model('president', presidentSchema);
