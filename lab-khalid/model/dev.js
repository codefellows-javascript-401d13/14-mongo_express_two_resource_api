'use strict';

const
  mongoose = require('mongoose'),
  debug = require('debug')('employee:dev');

const devSchema = mongoose.Schema({
  name: {type: String, required: true},
  language: {type: String, required: true},
  EID: {type: mongoose.Schema.Types.ObjectId, required: true}
});
debug('dev.js');
module.exports = mongoose.model('dev', devSchema);
