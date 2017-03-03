'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
const Schema = mongoose.Schema;

const playaSchema = Schema({
  playaName: { type: String, required: true },
  swagLevel: { type: Number, required: true },
  squadID: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model('Playa', playaSchema);
