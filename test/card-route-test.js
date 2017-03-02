'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const Card = require('../model/card.js');

const PORT = process.env.PORT || 3000;
const url = `http://localhost:${PORT}`;

require('../server.js');

const sampleCard = {
  brand: 'Donruss',
  completeSet: false,
  single: true
};

const sampleBaseball = {
  year: '1952',
  player: 'Mickey Mantle'
};
