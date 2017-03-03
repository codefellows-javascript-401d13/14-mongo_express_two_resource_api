'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videogameSchema = Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    platformID: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('videogame', videogameSchema);