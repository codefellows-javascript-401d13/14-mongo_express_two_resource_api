'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('card:card');
const Schema = mongoose.Schema;

const Baseball = require('./baseball.js');

const cardSchema = Schema({
  brand: { type: String, required: true},
  completeSet: { type: Boolean, required: true},
  single: {type: Boolean, required: true},
  baseballArr: [{ type: Schema.Types.ObjectId, ref: 'baseball'}]
});

const Card = module.exports = mongoose.model('card', cardSchema);

Card.findByIdAndAddBaseball = function(id, baseball) {
  debug('findByIdAndAddBaseball');

  return Card.findById(id)
  .catch( err => Promise.reject(createError(404, err.message)))
  .then( card => {
    baseball.cardId = card._id;
    this.tempCard = card;
    return new Baseball(baseball).save();
  })
  .then( _baseball => {
    this.tempCard.baseballArr.push(_baseball._id);
    this.tempBaseball = _baseball;
    return this.tempCard.save();
  })
  .then( () => {
    return this.tempBaseball;
  });
};
