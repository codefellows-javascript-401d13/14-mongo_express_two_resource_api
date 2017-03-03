'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bikeSchema = new Schema({
  name : {type: String, required: true},
  description: {type: String, required: true},
  quiverID : { type: Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('bike', bikeSchema);