'use strict';

const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const peakSchema = Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  mountainsID: {type: Schema.Types.ObjectId, required: true } //this property is how the Mountains will know to put Peak in the "peak" array
});

module.exports = mongoose.model('peak', peakSchema); //'peak' is also used to reference to the Mountains
