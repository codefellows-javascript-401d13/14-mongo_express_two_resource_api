'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeSchema = Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  storeID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('employee', employeeSchema);
