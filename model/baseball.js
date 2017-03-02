'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.schema;

const baseballSchema = Schema({
  year: { type: String, required: true },
  player: { type: String, required: false},
  cardId: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('baseball', baseballSchema);
