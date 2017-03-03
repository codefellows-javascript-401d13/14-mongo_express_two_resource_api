'use strict';

const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('videogame:platform');
const Schema = mongoose.Schema;

const Videogame = require('./videogame.js');

const platformSchema = Schema({
    name: { type: String, required: true },
    timestamp: { type: Date, required: true },
    videogames: [{ type: Schema.Types.ObjectId, ref: 'videogame' }]
});

const Platform = module.exports = mongoose.model('platform', platformSchema);

Platform.findByIdAndAddVideogame = function(id, videogame) {
    debug('findByIdAndAddVideogame');

    return Platform.findById(id)
    .catch( err => Promise.reject(createError(404, err.message)))
    .then( platform => {
        videogame.platformID = platform._id;
        this.tempPlatform = platform;
        return new Videogame(videogame).save();
    })
    .then( videogame => {
        this.tempPlatform.videogames.push(videogame._id);
        this.tempVideogame = videogame;
        return this.tempPlatform.save();
    })
    .then( () => {
        return this.tempVideogame;
    });
};