'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const journalSchema = Schema({
  title: { type: String, required: true },
  entry: { type: String, required: true },
  libraryID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('journal', journalSchema);
