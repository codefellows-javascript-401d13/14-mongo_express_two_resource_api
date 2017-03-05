'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseballSchema = Schema({
  year: { type: String, required: true },
  player: { type: String, required: false},
  cardId: { type: Schema.Types.ObjectId, required: true }
});

baseballSchema.pre('remove', function(next) {
  this.model('card').remove({ baseballArr: this._id }, next);
});

module.exports = mongoose.model('baseball', baseballSchema);
