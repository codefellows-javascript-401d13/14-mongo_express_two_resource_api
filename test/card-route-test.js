'use strict';

const request = require('superagent');
const expect = require('chai').expect;
const Card = require('../model/card.js');

const PORT = process.env.PORT || 3000;
