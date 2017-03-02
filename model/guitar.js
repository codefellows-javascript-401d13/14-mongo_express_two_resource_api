'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guitarSchema = Schema({
  name: { type: String, required: true},
  type: { type: String, required: true},
  make: { type: String, required: true},
  quiverID: [{ type: Schema.Types.ObjectId, req: true}]
});

module.exports = mongoose.model('guitar', guitarSchema);
